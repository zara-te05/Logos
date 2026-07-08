use std::io::Write;
use std::path::PathBuf;
use std::process::Stdio;
use std::sync::Mutex;

use serde::Serialize;
use tauri::{AppHandle, Emitter};
use tokio::io::{AsyncBufReadExt, AsyncReadExt, AsyncWriteExt, BufReader};
use tokio::process::Command;
use tokio::sync::mpsc;

// ─────────────────────────────────────────────────────────────────────────────
// Estructuras de datos
// ─────────────────────────────────────────────────────────────────────────────

#[derive(Serialize, Clone)]
pub struct ReOutput {
    pub text: String,
    pub is_stderr: bool,
}

#[derive(Serialize, Clone)]
pub struct ReDone {
    pub exit_code: i32,
}

#[derive(Serialize, Clone)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
}

// ─────────────────────────────────────────────────────────────────────────────
// Estado global del proceso en ejecución (para poder enviar stdin)
// ─────────────────────────────────────────────────────────────────────────────

pub struct RunningProcess {
    pub stdin_tx: Option<mpsc::Sender<String>>,
}

pub struct AppState {
    pub running: Mutex<Option<RunningProcess>>,
}

// ─────────────────────────────────────────────────────────────────────────────
// Comando: run_re_program
// Ejecuta código RE de forma interactiva con streaming de salida.
// ─────────────────────────────────────────────────────────────────────────────
#[tauri::command]
async fn run_re_program(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
    code: String,
    re_path: String,
) -> Result<(), String> {
    // 1. Guardar código en archivo temporal
    let tmp_file = tempfile::Builder::new()
        .suffix(".re")
        .tempfile()
        .map_err(|e| format!("No se pudo crear archivo temporal: {}", e))?;

    {
        let mut f = std::fs::File::create(tmp_file.path())
            .map_err(|e| format!("No se pudo escribir archivo temporal: {}", e))?;
        f.write_all(code.as_bytes())
            .map_err(|e| format!("Error escribiendo código: {}", e))?;
    }

    let tmp_path = tmp_file.path().to_path_buf();
    let re_js = PathBuf::from(&re_path)
        .join("dist")
        .join("compiler.cli")
        .join("re.js");

    if !re_js.exists() {
        return Err(format!(
            "Motor RE no encontrado en: {}. ¿Está compilado el proyecto RE?",
            re_js.display()
        ));
    }

    // 2. Canal para enviar stdin al proceso hijo
    let (stdin_tx, mut stdin_rx) = mpsc::channel::<String>(32);

    // Guardar el sender en el estado global
    {
        let mut running = state.running.lock().unwrap();
        *running = Some(RunningProcess {
            stdin_tx: Some(stdin_tx),
        });
    }

    // 3. Spawnear proceso hijo
    let mut child = Command::new("node")
        .arg(re_js.to_str().unwrap())
        .arg(tmp_path.to_str().unwrap())
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("No se pudo iniciar node: {}", e))?;

    let mut child_stdin = child.stdin.take().unwrap();
    let child_stdout = child.stdout.take().unwrap();
    let child_stderr = child.stderr.take().unwrap();

    let app_out = app.clone();
    let app_err = app.clone();
    let app_done = app.clone();

    // 4. Tarea: leer stdout y emitir eventos
    //    Usamos lectura por chunks en lugar de líneas para capturar
    //    prompts de input() que no terminan en \n (ej. "¿Tu nombre? ").
    let stdout_task = tokio::spawn(async move {
        let mut reader = BufReader::new(child_stdout);
        let mut buf = [0u8; 256];
        let mut line_buf = String::new();

        loop {
            match reader.read(&mut buf).await {
                Ok(0) => {
                    // EOF: emitir lo que quede en el buffer sin \n
                    if !line_buf.is_empty() {
                        let _ = app_out.emit("re-output", ReOutput {
                            text: line_buf.clone(),
                            is_stderr: false,
                        });
                        line_buf.clear();
                    }
                    break;
                }
                Ok(n) => {
                    let chunk = String::from_utf8_lossy(&buf[..n]);
                    line_buf.push_str(&chunk);

                    // Emitir líneas completas (terminadas en \n)
                    while let Some(pos) = line_buf.find('\n') {
                        let line = line_buf[..pos].trim_end_matches('\r').to_string();
                        let _ = app_out.emit("re-output", ReOutput {
                            text: line,
                            is_stderr: false,
                        });
                        line_buf = line_buf[pos + 1..].to_string();
                    }

                    // Si queda texto SIN \n (prompt de input()), emitirlo de inmediato
                    // para que el frontend lo muestre y abra el campo de escritura.
                    if !line_buf.is_empty() {
                        let _ = app_out.emit("re-output", ReOutput {
                            text: line_buf.clone(),
                            is_stderr: false,
                        });
                        line_buf.clear();
                    }
                }
                Err(_) => break,
            }
        }
    });

    // 5. Tarea: leer stderr y emitir eventos
    let stderr_task = tokio::spawn(async move {
        let reader = BufReader::new(child_stderr);
        let mut lines = reader.lines();
        while let Ok(Some(line)) = lines.next_line().await {
            let _ = app_err.emit("re-output", ReOutput {
                text: line,
                is_stderr: true,
            });
        }
    });

    // 6. Tarea: leer canal stdin_rx y escribir al proceso
    let stdin_task = tokio::spawn(async move {
        while let Some(input) = stdin_rx.recv().await {
            let line = if input.ends_with('\n') {
                input
            } else {
                format!("{}\n", input)
            };
            if child_stdin.write_all(line.as_bytes()).await.is_err() {
                break;
            }
        }
    });

    // 7. Esperar a que el proceso termine, luego emitir re-done
    tokio::spawn(async move {
        let _ = stdout_task.await;
        let _ = stderr_task.await;
        stdin_task.abort();

        let exit_code = child.wait().await
            .map(|s| s.code().unwrap_or(0))
            .unwrap_or(-1);

        let _ = app_done.emit("re-done", ReDone { exit_code });

        // Limpiar archivo temporal (se borra automáticamente al soltar tmp_file)
        drop(tmp_file);
    });

    Ok(())
}

// ─────────────────────────────────────────────────────────────────────────────
// Comando: send_re_input
// Envía una línea de texto al stdin del proceso RE en ejecución.
// ─────────────────────────────────────────────────────────────────────────────
#[tauri::command]
async fn send_re_input(
    state: tauri::State<'_, AppState>,
    input: String,
) -> Result<(), String> {
    let tx = {
        let running = state.running.lock().unwrap();
        running.as_ref()
            .and_then(|r| r.stdin_tx.clone())
    };

    if let Some(tx) = tx {
        tx.send(input).await
            .map_err(|_| "El proceso RE ya no está en ejecución.".to_string())
    } else {
        Err("No hay ningún proceso RE en ejecución.".to_string())
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Comando: check_re_code
// Análisis estático con --check. Retorna errores sin ejecutar.
// ─────────────────────────────────────────────────────────────────────────────
#[derive(Serialize)]
pub struct CheckResult {
    pub success: bool,
    pub output: String,
}

#[tauri::command]
async fn check_re_code(code: String, re_path: String) -> Result<CheckResult, String> {
    // Guardar en archivo temporal
    let tmp_file = tempfile::Builder::new()
        .suffix(".re")
        .tempfile()
        .map_err(|e| format!("No se pudo crear archivo temporal: {}", e))?;

    {
        let mut f = std::fs::File::create(tmp_file.path())
            .map_err(|e| format!("No se pudo escribir archivo temporal: {}", e))?;
        f.write_all(code.as_bytes())
            .map_err(|e| format!("Error escribiendo código: {}", e))?;
    }

    let re_js = PathBuf::from(&re_path)
        .join("dist")
        .join("compiler.cli")
        .join("re.js");

    let output = Command::new("node")
        .arg(re_js.to_str().unwrap())
        .arg(tmp_file.path().to_str().unwrap())
        .arg("--check")
        .output()
        .await
        .map_err(|e| format!("No se pudo ejecutar node: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();
    let combined = if stderr.is_empty() { stdout } else { format!("{}{}", stdout, stderr) };

    Ok(CheckResult {
        success: output.status.success(),
        output: combined,
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// Comandos del Explorador de Archivos
// ─────────────────────────────────────────────────────────────────────────────

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path)
        .map_err(|e| format!("No se pudo leer '{}': {}", path, e))
}

#[tauri::command]
fn write_file(path: String, content: String) -> Result<(), String> {
    // Crear directorios padre si no existen
    if let Some(parent) = std::path::Path::new(&path).parent() {
        std::fs::create_dir_all(parent)
            .map_err(|e| format!("No se pudo crear directorio: {}", e))?;
    }
    std::fs::write(&path, content)
        .map_err(|e| format!("No se pudo guardar '{}': {}", path, e))
}

#[tauri::command]
fn list_directory(path: String) -> Result<Vec<FileEntry>, String> {
    let entries = std::fs::read_dir(&path)
        .map_err(|e| format!("No se pudo leer directorio '{}': {}", path, e))?;

    let mut result: Vec<FileEntry> = entries
        .filter_map(|e| e.ok())
        .map(|e| {
            let meta = e.metadata().ok();
            let is_dir = meta.as_ref().map_or(false, |m| m.is_dir());
            let size = meta.as_ref().map_or(0, |m| if m.is_file() { m.len() } else { 0 });
            FileEntry {
                name: e.file_name().to_string_lossy().to_string(),
                path: e.path().to_string_lossy().to_string(),
                is_dir,
                size,
            }
        })
        .collect();

    // Ordenar: directorios primero, luego archivos, ambos alfabéticamente
    result.sort_by(|a, b| {
        match (a.is_dir, b.is_dir) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
        }
    });

    Ok(result)
}

#[tauri::command]
fn get_home_dir() -> String {
    dirs_next::home_dir()
        .unwrap_or_else(|| PathBuf::from("/"))
        .to_string_lossy()
        .to_string()
}

// ─────────────────────────────────────────────────────────────────────────────
// Punto de entrada de la librería Tauri
// ─────────────────────────────────────────────────────────────────────────────

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            running: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            run_re_program,
            send_re_input,
            check_re_code,
            read_file,
            write_file,
            list_directory,
            get_home_dir,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
