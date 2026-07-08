import "./index.css";
declare const ace: any;

/* ════════════════════════════════
   CODE EDITOR
   ════════════════════════════════ */
const INIT_CODE = `program Principal {
  // Entrada de datos
  string nombre = input("¿Tu nombre? ");
  print("¡Hola, " + nombre + "!");

  // Calcular área de triángulo
  int area = calcularArea(10, 5);
  print("Área: " + to_str(area));

  // Pi aproximado
  double pi = 3.14159;
  double suma = pi + pi;
  print("Suma: " + to_str(suma));
}`;

// Configurar base path para Ace Editor
ace.config.set("basePath", "/ace");

// Registrar el modo RE en Ace
ace.define("ace/mode/re_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function(acequire: any, exports: any, _module: any) {
    const oop = acequire("../lib/oop");
    const TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

    const ReHighlightRules = function(this: any) {
        const keywords = (
            "program|string|int|double|bool|var|if|else|while|do|for|in|return|print|input|to_str|to_int|to_double|list|array|queue|stack"
        );

        this.$rules = {
            "start": [
                {
                    token: "comment",
                    regex: "\\/\\/.*$"
                },
                {
                    token: "string",
                    regex: '".*?"'
                },
                {
                    token: "constant.numeric",
                    regex: "\\b\\d+(?:\\.\\d*)?\\b"
                },
                {
                    token: "keyword",
                    regex: "\\b(" + keywords + ")\\b"
                },
                {
                    token: "support.function",
                    regex: "\\b[a-zA-Z_]\\w*(?=\\s*\\()"
                },
                {
                    token: "variable.parameter",
                    regex: "\\b[a-zA-Z_]\\w*\\b"
                }
            ]
        };
        this.normalizeRules();
    };

    oop.inherits(ReHighlightRules, TextHighlightRules);
    exports.ReHighlightRules = ReHighlightRules;
});

ace.define("ace/mode/re", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/re_highlight_rules"], function(acequire: any, exports: any, _module: any) {
    const oop = acequire("../lib/oop");
    const TextMode = acequire("./text").Mode;
    const ReHighlightRules = acequire("./re_highlight_rules").ReHighlightRules;

    const Mode = function(this: any) {
        this.HighlightRules = ReHighlightRules;
        this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);

    (function(this: any) {
        this.lineCommentStart = "//";
        this.$id = "ace/mode/re";
    }).call(Mode.prototype);

    exports.Mode = Mode;
});

// Inicializar el editor Ace sobre #codeArea
const editor = ace.edit("codeArea");
editor.setTheme("ace/theme/one_dark");
editor.session.setMode("ace/mode/re");

editor.setOptions({
    fontSize: "13px",
    fontFamily: "'Space Mono', monospace",
    showPrintMargin: false,
    displayIndentGuides: true,
    tabSize: 2,
    useSoftTabs: true
});

function setCode(code: string) {
    editor.setValue(code, -1);
}

setCode(INIT_CODE);

function updateCursorPos() {
    const pos = editor.getCursorPosition();
    document.getElementById('cursorLine')!.textContent = String(pos.row + 1);
    document.getElementById('cursorCol')!.textContent = String(pos.column + 1);
}
editor.selection.on('changeCursor', updateCursorPos);

/* ════════════════════════════════
   TAURI IPC
   ════════════════════════════════ */

// Tauri está disponible como global gracias a withGlobalTauri: true
const { invoke } = (window as any).__TAURI__.core;
const { listen } = (window as any).__TAURI__.event;

// Ruta absoluta al directorio del motor RE (relativa al workspace)
// En desarrollo Tauri, el CWD es la carpeta Logos-Front.
// El directorio RE está un nivel arriba.
async function getRePath(): Promise<string> {
    // Intentar usar el comando get_home_dir para confirmar que Tauri IPC funciona,
    // luego construir la ruta a RE usando la ruta del ejecutable relativa al proyecto.
    // En dev mode, __TAURI__.path nos da la appLocalDataDir, pero lo más simple
    // es que el usuario configure la ruta, o usamos una ruta relativa al CWD.
    // En producción, se recomienda empaquetar el intérprete junto al .exe.
    // Por ahora calculamos la ruta esperada con respecto a la estructura del proyecto:
    // Logos-Front/../RE → RE
    try {
        // Leer ruta guardada por el usuario en localStorage, o usar la default
        return String(window.localStorage.getItem('re_path') || defaultRePath);
    } catch {
        return defaultRePath;
    }
}

// Ruta por defecto al motor RE (relativa al workspace Logos-Front, nivel arriba = RE)
// Se puede sobreescribir guardando en localStorage key='re_path'
const defaultRePath = (() => {
    // En Tauri dev, el proceso se lanza desde Logos-Front/
    // La ruta al motor RE está en ../RE relativo a Logos-Front
    // Usamos un path que el backend Rust resolverá de manera absoluta si se pasa
    // la ruta absoluta. Lo más seguro: el usuario puede configurarla.
    // Default: ruta conocida del proyecto en este equipo.
    return 'c:\\Users\\zarat\\Logos\\RE';
})();

/* ════════════════════════════════
   TERMINAL
   ════════════════════════════════ */
const termWrap = document.getElementById('termWrap') as HTMLDivElement;
const termOutput = document.getElementById('termOutput') as HTMLDivElement;
const termStatus = document.getElementById('termStatus') as HTMLSpanElement;
const btnCollapseTerm = document.getElementById('btnCollapseTerm') as HTMLButtonElement;
const termInputArea = document.getElementById('termInputArea') as HTMLDivElement;
const termInputField = document.getElementById('termInputField') as HTMLInputElement;
const termInputSend = document.getElementById('termInputSend') as HTMLButtonElement;
const btnStop = document.getElementById('btnStop') as HTMLButtonElement;

let termH = 220, termCollapsed = false;
let isRunning = false;
let unlistenOutput: (() => void) | null = null;
let unlistenDone: (() => void) | null = null;

// Ruta actual del archivo abierto (para guardar con Ctrl+S)
let currentFilePath: string | null = null;

btnCollapseTerm.addEventListener('click', () => {
    termCollapsed = !termCollapsed;
    termWrap.style.height = termCollapsed ? '32px' : termH + 'px';
    btnCollapseTerm.textContent = termCollapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
});

document.getElementById('btnRun')!.addEventListener('click', runCode);
document.getElementById('btnClear')!.addEventListener('click', () => {
    termOutput.innerHTML =
        '<div class="out-line"><span class="out-prompt">›</span><span class="cursor-blink">_</span></div>';
    termStatus.textContent = 'Esperando ejecución…';
    termStatus.style.color = 'var(--tertiary)';
    hideTermInput();
    if (termCollapsed) {
        termCollapsed = false;
        termWrap.style.height = termH + 'px';
        btnCollapseTerm.textContent = 'keyboard_arrow_down';
    }
});

btnStop.addEventListener('click', async () => {
    // Enviar señal de fin al proceso cerrando stdin
    try {
        await invoke('send_re_input', { input: '\x03' }); // Ctrl+C
    } catch (_) {}
    setRunningState(false);
    appendLine('[SISTEMA] Ejecución interrumpida.', 'out-sys');
});

/* ── Helpers de terminal ── */
function appendLine(text: string, cls: string = 'out-text') {
    // Quitar cursor parpadeante si existe
    termOutput.querySelector('.cursor-blink')?.parentElement?.remove();
    const d = document.createElement('div');
    d.className = 'out-line';
    // Escapar HTML básico para seguridad
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    d.innerHTML = `<span class="out-prompt">›</span><span class="${cls}">${escaped}</span>`;
    termOutput.appendChild(d);
    termOutput.scrollTop = termOutput.scrollHeight;
}

function showTermInput() {
    termInputArea.style.display = 'flex';
    termInputField.value = '';
    termInputField.focus();
}

function hideTermInput() {
    termInputArea.style.display = 'none';
    termInputField.value = '';
}

function setRunningState(running: boolean) {
    isRunning = running;
    const btnRun = document.getElementById('btnRun') as HTMLButtonElement;
    btnRun.disabled = running;
    btnStop.style.display = running ? 'inline-flex' : 'none';
    if (!running) hideTermInput();
}

/* ── Enviar input al proceso RE ── */
async function sendInput() {
    const val = termInputField.value;
    if (!isRunning) return;
    appendLine(val, 'out-dim'); // Mostrar lo que escribió el usuario
    hideTermInput();
    try {
        await invoke('send_re_input', { input: val });
    } catch (e) {
        appendLine(`[Error enviando input]: ${e}`, 'out-err');
    }
}

termInputSend.addEventListener('click', sendInput);
termInputField.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); sendInput(); }
});

/* ── runCode: ejecutar con IPC real ── */
async function runCode() {
    if (isRunning) return;

    if (termCollapsed) {
        termCollapsed = false;
        termWrap.style.height = termH + 'px';
        btnCollapseTerm.textContent = 'keyboard_arrow_down';
    }

    // Limpiar terminal
    termOutput.innerHTML = '';
    hideTermInput();

    termStatus.textContent = 'Ejecutando…';
    termStatus.style.color = 'var(--primary)';
    appendLine('[SISTEMA] Iniciando intérprete RE…', 'out-sys');

    setRunningState(true);

    const code = editor.getValue();
    const rePath = await getRePath();

    // Limpiar listeners anteriores si los hay
    if (unlistenOutput) { unlistenOutput(); unlistenOutput = null; }
    if (unlistenDone) { unlistenDone(); unlistenDone = null; }

    // Suscribirse a eventos de salida del proceso
    unlistenOutput = await listen('re-output', (event: any) => {
        const { text, is_stderr } = event.payload as { text: string; is_stderr: boolean };

        const cls = is_stderr ? 'out-err' : 'out-text';
        appendLine(text, cls);

        // Detectar si la línea es un prompt de input() que espera escritura del usuario.
        // Gracias a la lectura por chunks del backend Rust, el prompt llega como texto
        // parcial sin \n. Heurística: stdout que termina en '?', ':', '>', '…' o espacio
        // — los patrones más habituales en mensajes de prompt interactivo.
        if (!is_stderr && isRunning) {
            const trimmed = text.trimEnd();
            const looksLikePrompt =
                trimmed.endsWith('?') ||
                trimmed.endsWith(':') ||
                trimmed.endsWith('>') ||
                trimmed.endsWith('…') ||
                text.endsWith(' ');   // "¿Tu nombre? " termina en espacio

            if (looksLikePrompt) {
                showTermInput();
            }
        }
    });

    unlistenDone = await listen('re-done', (event: any) => {
        const { exit_code } = event.payload as { exit_code: number };

        // Remover listeners
        if (unlistenOutput) { unlistenOutput(); unlistenOutput = null; }
        if (unlistenDone) { unlistenDone(); unlistenDone = null; }

        hideTermInput();
        setRunningState(false);

        if (exit_code === 0) {
            appendLine(`Proceso finalizado con código 0`, 'out-ok');
            termStatus.textContent = 'Finalizado · código 0';
            termStatus.style.color = 'var(--tertiary)';
            showToast('Ejecución completada ✓');
        } else {
            appendLine(`Proceso finalizado con código ${exit_code}`, 'out-err');
            termStatus.textContent = `Error · código ${exit_code}`;
            termStatus.style.color = '#ff6b6b';
            showToast(`Error en ejecución (código ${exit_code})`);
        }
        // Añadir cursor parpadeante al final
        const d = document.createElement('div');
        d.className = 'out-line';
        d.innerHTML = '<span class="out-prompt">›</span><span class="cursor-blink">_</span>';
        termOutput.appendChild(d);
        termOutput.scrollTop = termOutput.scrollHeight;
    });

    // Invocar el comando Rust
    try {
        await invoke('run_re_program', { code, rePath });
    } catch (e: any) {
        setRunningState(false);
        if (unlistenOutput) { unlistenOutput(); unlistenOutput = null; }
        if (unlistenDone) { unlistenDone(); unlistenDone = null; }
        appendLine(`[Error IPC]: ${e}`, 'out-err');
        appendLine('¿Está el motor RE compilado y configurada la ruta?', 'out-dim');
        termStatus.textContent = 'Error de configuración';
        termStatus.style.color = '#ff6b6b';
        showToast('Error al iniciar el intérprete');
    }
}

document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        runCode();
    }
});


/* Terminal resizer */
const termResizer = document.getElementById('termResizer') as HTMLDivElement;
let termRes = false,
    termResY = 0,
    termResH = 220;
termResizer.addEventListener('mousedown', e => {
    termRes = true;
    termResY = e.clientY;
    termResH = termH;
    termResizer.classList.add('dragging');
    document.body.classList.add('row-resize');
    e.preventDefault();
});
document.addEventListener('mousemove', e => {
    if (!termRes) return;
    const delta = termResY - e.clientY;
    termH = Math.max(60, Math.min(520, termResH + delta));
    if (!termCollapsed) termWrap.style.height = termH + 'px';
});
document.addEventListener('mouseup', () => {
    if (termRes) {
        termRes = false;
        termResizer.classList.remove('dragging');
        document.body.classList.remove('row-resize');
    }
});

/* ════════════════════════════════
   SIDE PANEL
   ════════════════════════════════ */
const sideWrap = document.getElementById('sideWrap') as HTMLDivElement;
let sideOpen = true,
    sideW = 240,
    currentView = 'code';

function toggleSection(hdr: HTMLElement) {
    const body = hdr.nextElementSibling as HTMLDivElement;
    const arrow = hdr.querySelector('.exp-arrow') as HTMLSpanElement;
    const isOpen = body.style.maxHeight !== '0px' && body.style.maxHeight !== '';
    body.style.maxHeight = isOpen ? '0px' : '400px';
    arrow.style.transform = isOpen ? 'rotate(-90deg)' : 'rotate(0deg)';
}
// init open
document.querySelectorAll('.tool-section-body,.exp-files').forEach(b => (b as HTMLElement).style.maxHeight = '400px');

function setSidePanelMode(mode: string) {
    document.getElementById('explorerContent')!.style.display = mode === 'code' ? 'flex' : 'none';
    document.getElementById('toolboxContent')!.style.display = mode === 'flow' ? 'flex' : 'none';
    const titleEl = document.getElementById('sideTitle')!;
    if (mode === 'code') {
        titleEl.innerHTML = '<span class="ico">folder_open</span> EXPLORADOR';
    } else {
        titleEl.innerHTML = '<span class="ico">construction</span> HERRAMIENTAS';
    }
}
document.getElementById('btnCloseSide')!.addEventListener('click', () => toggleSide(false));
document.getElementById('btnSide')!.addEventListener('click', () => toggleSide());

function toggleSide(open?: boolean) {
    sideOpen = open !== undefined ? open : !sideOpen;
    sideWrap.classList.toggle('collapsed', !sideOpen);
    if (sideOpen) sideWrap.style.width = sideW + 'px';
    else sideWrap.style.width = '0';
    showToast(sideOpen ? 'Panel lateral abierto' : 'Panel lateral cerrado');
}
/* ── Explorador de Archivos (IPC real) ── */

// Directorio actual del explorador
let explorerDir: string = 'c:\\Users\\zarat\\Logos\\RE';

// Archivo actualmente abierto (ruta absoluta)
// currentFilePath ya declarado arriba

async function loadDirectory(dirPath: string) {
    try {
        const entries: Array<{ name: string; path: string; is_dir: boolean; size: number }> =
            await invoke('list_directory', { path: dirPath });

        explorerDir = dirPath;
        const expFiles = document.getElementById('expFiles')!;
        expFiles.innerHTML = '';

        // Título del explorador
        const folderName = dirPath.split(/[/\\]/).pop() || dirPath;
        const expHdrSpan = document.querySelector('#expHdr > span:last-child');
        if (expHdrSpan) expHdrSpan.textContent = folderName.toUpperCase();

        // Botón para subir un nivel (si no estamos en la raíz)
        const parts = dirPath.replace(/\\/g, '/').split('/').filter(Boolean);
        if (parts.length > 1) {
            const upEl = document.createElement('div');
            upEl.className = 'file-item';
            upEl.innerHTML = '<span class="file-ico">arrow_upward</span>..';
            upEl.title = 'Subir un nivel';
            upEl.addEventListener('click', () => {
                const parent = parts.slice(0, -1).join('\\');
                loadDirectory(parent.startsWith('c:') ? parent : '\\' + parent);
            });
            expFiles.appendChild(upEl);
        }

        // Renderizar entradas
        for (const entry of entries) {
            const el = document.createElement('div');
            el.className = 'file-item';
            const ico = entry.is_dir ? 'folder' : (entry.name.endsWith('.re') ? 'description' : 'insert_drive_file');
            el.innerHTML = `<span class="file-ico">${ico}</span>${entry.name}`;
            el.title = entry.path;

            el.addEventListener('click', async () => {
                document.querySelectorAll('.file-item').forEach(e => e.classList.remove('active'));
                el.classList.add('active');
                if (entry.is_dir) {
                    loadDirectory(entry.path);
                } else {
                    await openFile(entry.path);
                }
            });
            expFiles.appendChild(el);
        }
    } catch (e) {
        showToast('Error al leer directorio: ' + e);
    }
}

async function openFile(filePath: string) {
    try {
        const content: string = await invoke('read_file', { path: filePath });
        setCode(content);
        currentFilePath = filePath;
        const fileName = filePath.split(/[/\\]/).pop() || filePath;
        showToast('Abierto: ' + fileName);
        // Actualizar pestaña activa si hay elementos de tab
        const tabLabel = document.querySelector('.tab.active .tab-name');
        if (tabLabel) tabLabel.textContent = fileName;
    } catch (e) {
        showToast('Error al abrir archivo: ' + e);
    }
}

async function saveCurrentFile() {
    if (!currentFilePath) {
        showToast('No hay archivo abierto para guardar');
        return;
    }
    try {
        const content = editor.getValue();
        await invoke('write_file', { path: currentFilePath, content });
        showToast('Guardado: ' + currentFilePath.split(/[/\\]/).pop());
    } catch (e) {
        showToast('Error al guardar: ' + e);
    }
}

// Ctrl+S para guardar
document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveCurrentFile();
    }
});

// Cargar directorio inicial al iniciar la app
setTimeout(() => {
    loadDirectory(explorerDir).catch(() => {
        // Si falla (ej. en navegador sin Tauri), mantener los items estáticos del HTML
    });
}, 500);

/* ════════════════════════════════
   HITO 4: DIAGNÓSTICO Y LINTING
   ════════════════════════════════ */

/** Temporizador del debounce de linting */
let lintDebounce: ReturnType<typeof setTimeout> | null = null;

/** Marcadores de subrayado activos en Ace (para poder limpiarlos) */
const activeMarkerIds: number[] = [];

/** Indicador de estado de linting en la barra inferior */
const lintStatusEl = document.getElementById('lintStatus') as HTMLSpanElement | null;

/**
 * Actualiza el indicador visual de linting en la barra de estado.
 * @param state 'ok' | 'error' | 'checking' | 'idle'
 * @param count Número de errores (sólo relevante en state='error')
 */
function setLintStatus(state: 'ok' | 'error' | 'checking' | 'idle', count = 0) {
    if (!lintStatusEl) return;
    switch (state) {
        case 'checking':
            lintStatusEl.textContent = '⟳ Analizando…';
            lintStatusEl.className = 'lint-status lint-checking';
            break;
        case 'ok':
            lintStatusEl.textContent = '✓ Sin errores';
            lintStatusEl.className = 'lint-status lint-ok';
            break;
        case 'error':
            lintStatusEl.textContent = `✗ ${count} error${count !== 1 ? 'es' : ''}`;
            lintStatusEl.className = 'lint-status lint-error';
            break;
        case 'idle':
        default:
            lintStatusEl.textContent = '— Linting';
            lintStatusEl.className = 'lint-status lint-idle';
            break;
    }
}

/**
 * Parsea la salida de texto de check_re_code y extrae
 * los errores con línea, columna y mensaje.
 *
 * Formatos soportados del compilador RE:
 *   [SyntaxError] Línea L:C mensaje
 *   [TypeCheckError] en Línea L, Columna C: mensaje
 *   [LexerError] Línea L:C mensaje
 */
interface LintError {
    row: number;    // 0-indexed para Ace
    col: number;    // 0-indexed para Ace
    message: string;
    type: 'error' | 'warning';
}

function parseCheckOutput(output: string): LintError[] {
    const errors: LintError[] = [];

    // Patrón 1: [SyntaxError] / [LexerError] → "Línea L:C ..."
    const patternShort = /\[(SyntaxError|LexerError)\][^\n]*[Ll]ínea\s+(\d+):(\d+)\s*(.*)/g;
    let m: RegExpExecArray | null;
    while ((m = patternShort.exec(output)) !== null) {
        const row = Math.max(0, parseInt(m[2], 10) - 1);
        const col = Math.max(0, parseInt(m[3], 10) - 1);
        const msg = `[${m[1]}] ${m[4].trim()}`;
        errors.push({ row, col, message: msg, type: 'error' });
    }

    // Patrón 2: [TypeCheckError] → "en Línea L, Columna C: ..."
    const patternTypeCheck = /\[TypeCheckError\][^\n]*[Ll]ínea\s+(\d+),\s*[Cc]olumna\s+(\d+):\s*(.*)/g;
    while ((m = patternTypeCheck.exec(output)) !== null) {
        const row = Math.max(0, parseInt(m[1], 10) - 1);
        const col = Math.max(0, parseInt(m[2], 10) - 1);
        const msg = `[TypeCheckError] ${m[3].trim()}`;
        errors.push({ row, col, message: msg, type: 'error' });
    }

    // Patrón 3 (fallback genérico): "line L" o "línea L" sin columna
    const patternGeneric = /\[(SyntaxError|LexerError|TypeCheckError|Error)\][^\n]*(?:[Ll]ine|[Ll]ínea)\s+(\d+)(?:[^\d]|$)/g;
    while ((m = patternGeneric.exec(output)) !== null) {
        const row = Math.max(0, parseInt(m[2], 10) - 1);
        // Evitar duplicar si ya fue capturado por patrones específicos
        const alreadyCaptured = errors.some(e => e.row === row);
        if (!alreadyCaptured) {
            errors.push({ row, col: 0, message: m[0].trim(), type: 'error' });
        }
    }

    return errors;
}

/**
 * Limpia todas las anotaciones y marcadores de subrayado del editor.
 */
function clearLintMarkers() {
    editor.getSession().clearAnnotations();
    // Limpiar marcadores de subrayado anteriores
    while (activeMarkerIds.length > 0) {
        const id = activeMarkerIds.pop()!;
        editor.getSession().removeMarker(id);
    }
}

/**
 * Aplica las anotaciones y subrayados rojos en el editor Ace
 * a partir de la lista de errores parseados.
 */
function applyLintErrors(errors: LintError[]) {
    clearLintMarkers();

    if (errors.length === 0) {
        setLintStatus('ok');
        return;
    }

    // Anotaciones en el gutter (barra lateral)
    const annotations = errors.map(e => ({
        row: e.row,
        column: e.col,
        text: e.message,
        type: e.type   // 'error' → ícono rojo en gutter
    }));
    editor.getSession().setAnnotations(annotations);

    // Marcadores de subrayado (squiggly red underline)
    const Range = ace.require('ace/range').Range;
    errors.forEach(e => {
        const lineText: string = editor.getSession().getLine(e.row) || '';
        const startCol = e.col;
        // Subrayar desde la columna del error hasta el final del token/línea
        const endCol = lineText.length > startCol ? lineText.length : startCol + 1;
        const range = new Range(e.row, startCol, e.row, endCol);
        const markerId = editor.getSession().addMarker(range, 'lint-error-marker', 'text', false);
        activeMarkerIds.push(markerId);
    });

    setLintStatus('error', errors.length);
}

/**
 * Ejecuta el análisis estático del código actual (check_re_code)
 * y aplica los resultados en el editor.
 * Sólo se lanza si Tauri IPC está disponible.
 */
async function runLint() {
    const code = editor.getValue();
    const rePath = await getRePath();

    setLintStatus('checking');

    try {
        const result: { success: boolean; output: string } =
            await invoke('check_re_code', { code, rePath });

        if (result.success) {
            clearLintMarkers();
            setLintStatus('ok');
        } else {
            const errors = parseCheckOutput(result.output);
            applyLintErrors(errors);
        }
    } catch (_e) {
        // Si IPC falla (ej. navegador sin Tauri), no hacer nada
        setLintStatus('idle');
    }
}

/**
 * Hook en cambios del editor: debounce de 400ms antes de llamar a runLint.
 * Se dispara tanto en cambios de contenido como al abrir un nuevo archivo.
 */
editor.session.on('change', () => {
    if (lintDebounce !== null) clearTimeout(lintDebounce);
    lintDebounce = setTimeout(runLint, 400);
});

// Linting inicial al cargar la app (con un pequeño delay para que Tauri esté listo)
setTimeout(() => {
    setLintStatus('idle');
    runLint();
}, 800);


/* side resizer */
const sideResizer = document.getElementById('sideResizer') as HTMLDivElement;
let sideRes = false,
    sideResX = 0,
    sideResW = 240;
sideResizer.addEventListener('mousedown', e => {
    sideRes = true;
    sideResX = e.clientX;
    sideResW = sideW;
    sideResizer.classList.add('dragging');
    document.body.classList.add('col-resize');
    e.preventDefault();
});
document.addEventListener('mousemove', e => {
    if (!sideRes) return;
    sideW = Math.max(160, Math.min(480, sideResW + (e.clientX - sideResX)));
    sideWrap.style.width = sideW + 'px';
});
document.addEventListener('mouseup', () => {
    if (sideRes) {
        sideRes = false;
        sideResizer.classList.remove('dragging');
        document.body.classList.remove('col-resize');
        showToast('Panel: ' + sideW + 'px');
    }
});

/* ════════════════════════════════
   VIEW SWITCH
   ════════════════════════════════ */
const btnCode = document.getElementById('btnCode') as HTMLButtonElement,
    btnFlow = document.getElementById('btnFlow') as HTMLButtonElement;
const viewCode = document.getElementById('viewCode') as HTMLDivElement,
    viewFlow = document.getElementById('viewFlow') as HTMLDivElement;
const tabsCode = document.getElementById('tabsCode') as HTMLDivElement,
    tabsFlow = document.getElementById('tabsFlow') as HTMLDivElement;
const statusMode = document.getElementById('statusMode') as HTMLSpanElement;

function setView(v: string) {
    currentView = v;
    const isCode = v === 'code';
    viewCode.classList.toggle('hidden', !isCode);
    viewFlow.classList.toggle('hidden', isCode);
    tabsCode.classList.toggle('hidden', !isCode);
    tabsFlow.classList.toggle('hidden', isCode);
    btnCode.classList.toggle('active', isCode);
    btnFlow.classList.toggle('active', !isCode);
    statusMode.textContent = isCode ? 'CODE_EDITOR' : 'BLUEPRINT_CANVAS';
    setSidePanelMode(v);
    if (!isCode) resizeBpCanvas();
}
btnCode.addEventListener('click', () => setView('code'));
btnFlow.addEventListener('click', () => setView('flow'));

/* ════════════════════════════════
   BLUEPRINT ENGINE
   ════════════════════════════════ */
const bpCanvas = document.getElementById('bpCanvas') as HTMLCanvasElement;
const bpCtx = bpCanvas.getContext('2d')!;
const bpNodes = document.getElementById('bpNodes') as HTMLDivElement;
const blueprint = document.getElementById('blueprint') as HTMLDivElement;

interface NodeDef {
    id: number;
    type: string;
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    color: string;
}

interface ConnectionDef {
    from: number;
    fromPort: string;
    to: number;
    toPort: string;
    id: number;
}

let zoom = 1,
    panX = 0,
    panY = 0;
let nodes: NodeDef[] = [],
    connections: ConnectionDef[] = [],
    nodeIdCounter = 0;
let selectedNode: number | null = null,
    selectedColor = '#b8c3ff';
let currentTool = 'select';
let connectFrom: { id: number; port: string } | null = null; // {nodeId, port}
let history: { nodes: string; connections: string }[] = [];
let isPanning = false,
    panStart = { x: 0, y: 0 };

function resizeBpCanvas() {
    bpCanvas.width = blueprint.clientWidth;
    bpCanvas.height = blueprint.clientHeight;
    drawConnections();
}
window.addEventListener('resize', () => { if (currentView === 'flow') resizeBpCanvas(); });

/* ── TOOLS ── */
function setTool(t: string) {
    currentTool = t;
    connectFrom = null;
    ['select', 'connect', 'delete', 'pan'].forEach(n => {
        document.getElementById('tb' + cap(n))?.classList.toggle('active', n === t);
        document.getElementById('tool' + cap(n))?.classList.toggle('active', n === t);
    });
    if (t === 'connect') document.body.classList.add('crosshair');
    else document.body.classList.remove('crosshair');
    if (t === 'pan') document.body.classList.add('move-cursor');
    else document.body.classList.remove('move-cursor');
    const names: Record<string, string> = { select: 'Seleccionar', connect: 'Conectar', delete: 'Eliminar', pan: 'Desplazar' };
    showToast('Herramienta: ' + (names[t] || t));
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ── COLORS ── */
document.querySelectorAll('.swatch').forEach(sw => {
    (sw as HTMLElement).addEventListener('click', () => {
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        selectedColor = (sw as HTMLElement).dataset.color!;
        if (selectedNode !== null) {
            const nd = nodes.find(n => n.id === selectedNode);
            if (nd) {
                nd.color = selectedColor;
                renderNode(nd);
                drawConnections();
                showToast('Color aplicado al nodo seleccionado');
            }
        } else {
            showToast('Color por defecto cambiado');
        }
    });
});

/* ── NODE CREATION ── */
const NODE_DEFAULTS: Record<string, { w: number; h: number; label: string }> = {
    oval: { w: 120, h: 44, label: 'INICIO/FIN' },
    rect: { w: 180, h: 56, label: 'PROCESO' },
    diamond: { w: 110, h: 110, label: 'DECISIÓN' },
    para: { w: 180, h: 56, label: 'ENTRADA/SALIDA' },
    io: { w: 180, h: 56, label: 'DATO' },
    term: { w: 120, h: 44, label: 'TERMINAL' },
};

function createNode(type: string, x: number, y: number) {
    saveHistory();
    const def = NODE_DEFAULTS[type] || NODE_DEFAULTS.rect;
    const node: NodeDef = {
        id: ++nodeIdCounter,
        type,
        x: x - def.w / 2,
        y: y - def.h / 2,
        w: def.w,
        h: def.h,
        label: def.label,
        color: selectedColor
    };
    nodes.push(node);
    renderNode(node);
    updateStats();
    showToast('Nodo creado: ' + def.label);
    return node;
}

function renderNode(node: NodeDef) {
    let el = document.getElementById('fnode-' + node.id);
    if (!el) {
        el = document.createElement('div');
        el.id = 'fnode-' + node.id;
        el.className = `fnode fnode-${node.type}`;
        bpNodes.appendChild(el);
        attachNodeEvents(el, node);
    }

    // Position
    el.style.left = node.x + 'px';
    el.style.top = node.y + 'px';
    el.style.width = node.w + 'px';
    el.style.height = node.h + 'px';

    // inner content
    let inner = '';
    if (node.type === 'diamond') {
        inner = `<div class="fnode-inner">
      <div class="diamond-rot" style="border-color:${node.color}40"></div>
      <div class="diamond-label" style="color:${node.color};font-size:9px">${node.label}</div>
    </div>`;
    } else {
        inner = `<div class="fnode-inner" style="border-color:${node.color}50;color:${node.color}cc">
      <input class="node-label-edit" value="${node.label}" style="color:${node.color}cc"
        id="label-edit-${node.id}"/>
    </div>`;
    }
    // ports
    const ports = ['n', 's', 'e', 'w'].map(p =>
        `<div class="port port-${p}" data-port="${p}" data-id="${node.id}"></div>`).join('');
    el.innerHTML = inner + ports;

    // Attach listener for inputs
    const inputEl = el.querySelector(`#label-edit-${node.id}`) as HTMLInputElement;
    if (inputEl) {
        inputEl.addEventListener('dblclick', () => inputEl.focus());
        inputEl.addEventListener('blur', () => updateLabel(node.id, inputEl.value));
        inputEl.addEventListener('change', () => updateLabel(node.id, inputEl.value));
        inputEl.addEventListener('mousedown', (e) => e.stopPropagation());
    }

    el.querySelectorAll('.port').forEach(p => {
        (p as HTMLElement).addEventListener('mousedown', e => {
            e.stopPropagation();
            startConnect(node, (p as HTMLElement).dataset.port!, e);
        });
    });
    if (node.id === selectedNode) el.classList.add('selected');
}

function attachNodeEvents(el: HTMLElement, node: NodeDef) {
    let dragging = false,
        ox = 0,
        oy = 0,
        startX = 0,
        startY = 0;
    el.addEventListener('mousedown', e => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('port')) return;
        if (currentTool === 'delete') { deleteNode(node.id); return; }
        if (currentTool === 'connect') return;
        if (currentTool === 'select' || currentTool === 'pan') {
            selectNode(node.id);
            dragging = true;
            ox = e.clientX - node.x;
            oy = e.clientY - node.y;
            startX = node.x;
            startY = node.y;
            document.body.classList.add('move-cursor');
            e.stopPropagation();
        }
    });
    document.addEventListener('mousemove', ev => {
        if (!dragging) return;
        node.x = ev.clientX - ox;
        node.y = ev.clientY - oy;
        el.style.left = node.x + 'px';
        el.style.top = node.y + 'px';
        drawConnections();
    });
    document.addEventListener('mouseup', () => {
        if (dragging) {
            dragging = false;
            if (currentTool !== 'pan') document.body.classList.remove('move-cursor');
            if (node.x !== startX || node.y !== startY) saveHistory();
        }
    });
}

function updateLabel(id: number, val: string) {
    const n = nodes.find(n => n.id === id);
    if (n && val.trim()) {
        n.label = val.trim();
        showToast('Etiqueta: ' + n.label);
    }
}

function selectNode(id: number | null) {
    document.querySelectorAll('.fnode').forEach(e => e.classList.remove('selected'));
    selectedNode = id;
    if (id !== null) {
        document.getElementById('fnode-' + id)?.classList.add('selected');
        const nd = nodes.find(n => n.id === id);
        if (nd && nd.color !== selectedColor) {
            selectedColor = nd.color;
            document.querySelectorAll('.swatch').forEach(s => {
                s.classList.toggle('active', (s as HTMLElement).dataset.color === nd.color);
            });
        }
    }
}

function deleteNode(id: number) {
    saveHistory();
    const nd = nodes.find(n => n.id === id);
    nodes = nodes.filter(n => n.id !== id);
    connections = connections.filter(c => c.from !== id && c.to !== id);
    document.getElementById('fnode-' + id)?.remove();
    if (selectedNode === id) selectedNode = null;
    drawConnections();
    updateStats();
    if (nd) showToast('Nodo eliminado: ' + nd.label);
}

/* ── CONNECTIONS ── */
function startConnect(node: NodeDef, port: string, e: MouseEvent) {
    if (currentTool !== 'connect') return;
    connectFrom = { id: node.id, port };
    e.preventDefault();
}

bpNodes.addEventListener('mouseup', e => {
    if (!connectFrom) return;
    const target = e.target as HTMLElement;
    const portEl = target.closest('.port') as HTMLElement;
    if (!portEl) {
        connectFrom = null;
        drawConnections(); return;
    }
    const toId = parseInt(portEl.dataset.id!);
    const toPort = portEl.dataset.port!;
    if (toId !== connectFrom.id) {
        // check if connection already exists
        const exists = connections.some(c =>
            c.from === connectFrom!.id && c.fromPort === connectFrom!.port &&
            c.to === toId && c.toPort === toPort);
        if (!exists) {
            saveHistory();
            connections.push({
                from: connectFrom.id, fromPort: connectFrom.port, to: toId, toPort,
                id: ++nodeIdCounter
            });
            drawConnections();
            updateStats();
            showToast('Conexión creada');
        } else {
            showToast('La conexión ya existe');
        }
    }
    connectFrom = null;
});

/* ── DRAW CONNECTIONS ── */
function getPortPos(node: NodeDef, port: string) {
    const cx = node.x + node.w / 2,
        cy = node.y + node.h / 2;
    switch (port) {
        case 'n':
            return { x: cx, y: node.y };
        case 's':
            return { x: cx, y: node.y + node.h };
        case 'e':
            return { x: node.x + node.w, y: cy };
        case 'w':
            return { x: node.x, y: cy };
        default:
            return { x: cx, y: cy };
    }
}

function drawConnections() {
    bpCtx.clearRect(0, 0, bpCanvas.width, bpCanvas.height);
    bpCtx.strokeStyle = 'rgba(184,195,255,0.7)';
    bpCtx.lineWidth = 1.5;
    bpCtx.setLineDash([]);
    // arrowhead
    connections.forEach(c => {
        const from = nodes.find(n => n.id === c.from);
        const to = nodes.find(n => n.id === c.to);
        if (!from || !to) return;
        const p1 = getPortPos(from, c.fromPort);
        const p2 = getPortPos(to, c.toPort);
        const dx = p2.x - p1.x,
            dy = p2.y - p1.y;
        const cx1 = p1.x + dx * .4 + (dy != 0 ? dy * .2 : 0),
            cy1 = p1.y + dy * .4;
        const cx2 = p2.x - dx * .4,
            cy2 = p2.y - dy * .4;
        bpCtx.beginPath();
        bpCtx.moveTo(p1.x, p1.y);
        bpCtx.bezierCurveTo(cx1, cy1, cx2, cy2, p2.x, p2.y);
        bpCtx.stroke();
        // arrowhead
        const angle = Math.atan2(p2.y - cy2, p2.x - cx2);
        const al = 10,
            aw = 5;
        bpCtx.fillStyle = 'rgba(184,195,255,0.8)';
        bpCtx.beginPath();
        bpCtx.moveTo(p2.x, p2.y);
        bpCtx.lineTo(p2.x - al * Math.cos(angle - aw * .3), p2.y - al * Math.sin(angle - aw * .3));
        bpCtx.lineTo(p2.x - al * Math.cos(angle + aw * .3), p2.y - al * Math.sin(angle + aw * .3));
        bpCtx.closePath();
        bpCtx.fill();
    });
    // live connection preview
    if (connectFrom && mousePos) {
        const from = nodes.find(n => n.id === connectFrom!.id);
        if (from) {
            const p1 = getPortPos(from, connectFrom.port);
            bpCtx.strokeStyle = 'rgba(184,195,255,0.4)';
            bpCtx.setLineDash([5, 4]);
            bpCtx.beginPath();
            bpCtx.moveTo(p1.x, p1.y);
            bpCtx.lineTo(mousePos.x, mousePos.y);
            bpCtx.stroke();
            bpCtx.setLineDash([]);
        }
    }
}

let mousePos: { x: number; y: number } | null = null;
blueprint.addEventListener('mousemove', e => {
    const rect = blueprint.getBoundingClientRect();
    mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (connectFrom) drawConnections();
    // pan tool
    if (isPanning) {
        panX += e.clientX - panStart.x;
        panY += e.clientY - panStart.y;
        panStart = { x: e.clientX, y: e.clientY };
        bpNodes.style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`;
        bpNodes.style.transformOrigin = '0 0';
    }
});

blueprint.addEventListener('mousedown', e => {
    if (e.target === blueprint || e.target === bpCanvas || e.target === bpNodes) {
        selectNode(null);
        if (currentTool === 'pan') {
            isPanning = true;
            panStart = { x: e.clientX, y: e.clientY };
            document.body.classList.add('move-cursor');
        }
    }
});
blueprint.addEventListener('mouseup', () => {
    isPanning = false;
    if (currentTool !== 'pan') document.body.classList.remove('move-cursor');
});
blueprint.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    if (connectFrom && !target.closest('.port')) {
        connectFrom = null;
        drawConnections();
    }
});

/* ── DRAG FROM TOOLBOX ── */
let dragType: string | null = null;
document.querySelectorAll('.shape-card').forEach(card => {
    const cardEl = card as HTMLElement;
    cardEl.addEventListener('dragstart', e => {
        dragType = cardEl.dataset.type!;
        e.dataTransfer!.effectAllowed = 'copy';
        const g = document.getElementById('dragGhost') as HTMLDivElement;
        g.textContent = cardEl.textContent!.trim();
        g.style.display = 'block';
        e.dataTransfer!.setDragImage(g, 40, 20);
    });
    cardEl.addEventListener('dragend', () => {
        dragType = null;
        document.getElementById('dragGhost')!.style.display = 'none';
    });
});

blueprint.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'copy';
});
blueprint.addEventListener('drop', e => {
    e.preventDefault();
    if (!dragType) return;
    const rect = blueprint.getBoundingClientRect();
    const x = e.clientX - rect.left - panX;
    const y = e.clientY - rect.top - panY;
    createNode(dragType, x, y);
    setTool('select');
});

/* ── ZOOM ── */
function changeZoom(delta: number) {
    if (delta === 0) {
        zoom = 1;
        panX = 0;
        panY = 0;
    } else { zoom = Math.max(.25, Math.min(2.5, zoom + delta)); }
    bpNodes.style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`;
    bpNodes.style.transformOrigin = '0 0';
    document.getElementById('zoomLabel')!.textContent = Math.round(zoom * 100) + '%';
    if (delta === 0) showToast('Zoom reseteado');
}
blueprint.addEventListener('wheel', e => {
    e.preventDefault();
    changeZoom(e.deltaY < 0 ? .05 : -.05);
}, { passive: false });

/* ── HISTORY ── */
function saveHistory() {
    history.push({ nodes: JSON.stringify(nodes), connections: JSON.stringify(connections) });
    if (history.length > 50) history.shift();
}

function undo() {
    if (!history.length) { showToast('Nada que deshacer'); return; }
    const state = history.pop()!;
    nodes = JSON.parse(state.nodes);
    connections = JSON.parse(state.connections);
    bpNodes.innerHTML = '';
    nodes.forEach(n => renderNode(n));
    drawConnections();
    updateStats();
    showToast('Deshecho ✓');
}

/* ── ACTIONS ── */
function clearCanvas() {
    if (nodes.length && !confirm('¿Borrar todo el lienzo?')) return;
    saveHistory();
    nodes = [];
    connections = [];
    nodeIdCounter = 0;
    selectedNode = null;
    bpNodes.innerHTML = '';
    drawConnections();
    updateStats();
    showToast('Lienzo limpio');
}

function autoLayout() {
    if (!nodes.length) { showToast('No hay nodos para ordenar'); return; }
    saveHistory();
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const gx = 220,
        gy = 160,
        ox = 80,
        oy = 80;
    nodes.forEach((n, i) => {
        n.x = ox + (i % cols) * gx;
        n.y = oy + Math.floor(i / cols) * gy;
        renderNode(n);
    });
    drawConnections();
    showToast('Nodos reordenados');
}

function exportSVG() {
    showToast('Función de exportación SVG en desarrollo');
}

function updateStats() {
    document.getElementById('statNodes')!.textContent = String(nodes.length);
    document.getElementById('statLinks')!.textContent = String(connections.length);
    document.getElementById('flowStats')!.textContent =
        `${nodes.length} nodo${nodes.length !== 1 ? 's' : ''} · ${connections.length} enlace${connections.length !== 1 ? 's' : ''}`;
}

/* ── DEMO NODES ── */
function addDemoNodes() {
    const n1 = createNode('oval', 400, 80);
    n1.label = 'INICIO';
    const n2 = createNode('para', 400, 190);
    n2.label = 'LEER NOMBRE';
    const n3 = createNode('diamond', 400, 320);
    n3.label = '¿VACÍO?';
    const n4 = createNode('rect', 400, 480);
    n4.label = 'PRINT SALUDO';
    const n5 = createNode('oval', 400, 590);
    n5.label = 'FIN';
    n5.color = '#ffb4ab';
    connections.push({ from: n1.id, fromPort: 's', to: n2.id, toPort: 'n', id: ++nodeIdCounter });
    connections.push({ from: n2.id, fromPort: 's', to: n3.id, toPort: 'n', id: ++nodeIdCounter });
    connections.push({ from: n3.id, fromPort: 's', to: n4.id, toPort: 'n', id: ++nodeIdCounter });
    connections.push({ from: n4.id, fromPort: 's', to: n5.id, toPort: 'n', id: ++nodeIdCounter });
    nodes.forEach(n => renderNode(n));
    nodes.find(n => n.id === n5.id)!.color = '#ffb4ab';
    renderNode(nodes.find(n => n.id === n5.id)!);
    drawConnections();
    updateStats();
}

/* ── KEYBOARD ── */
document.addEventListener('keydown', e => {
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
    if (e.key === 'v' || e.key === 'V') setTool('select');
    if (e.key === 'c' || e.key === 'C') setTool('connect');
    if (e.key === 'd' || e.key === 'D') setTool('delete');
    if (e.key === 'p' || e.key === 'P') setTool('pan');
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
    }
    if (e.key === 'Delete' && selectedNode !== null) { deleteNode(selectedNode); }
    if (e.key === 'Escape') {
        selectNode(null);
        connectFrom = null;
        setTool('select');
    }
});

/* ── TOAST ── */
const toastEl = document.getElementById('toast') as HTMLDivElement;
let toastT: number;

function showToast(msg: string) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('show'), 2600) as unknown as number;
}

/* ════════════════════════════════
   HITO 5: SINCRONIZACIÓN BLUEPRINT ↔ CÓDIGO RE
   ════════════════════════════════ */
/** Badge SYNC en la barra de estado inferior */
const syncStatusEl = document.getElementById('syncStatus') as HTMLDivElement | null;
/**
 * Actualiza el indicador SYNC de la barra de estado.
 * @param state 'idle' | 'ok' | 'error'
 * @param msg   Texto alternativo opcional
 */
function setSyncStatus(state: 'idle' | 'ok' | 'error', msg?: string) {
    if (!syncStatusEl) return;
    const dot = syncStatusEl.querySelector('.status-dot') as HTMLElement | null;
    const lbl = syncStatusEl.querySelector('span:last-child') as HTMLElement | null;
    if (lbl) lbl.textContent = msg ?? (state === 'ok' ? 'SYNC ✓' : state === 'error' ? 'SYNC ✗' : 'SYNC');
    if (dot) {
        dot.style.background =
            state === 'ok'    ? '#a8e6cf' :
            state === 'error' ? '#ff6b6b' : '';
    }
}
/* ─────────────────────────────────────────────────────────
   A) blueprintToRE() — Compilador Visual → Código RE
   Recorre el grafo de nodos en orden topológico (BFS desde
   el primer nodo oval con label que contenga "INICIO" o el
   primer oval del array) y traduce cada nodo a código RE.
   ───────────────────────────────────────────────────────── */
function blueprintToRE(): void {
    if (nodes.length === 0) {
        showToast('El lienzo está vacío. Añade nodos primero.');
        return;
    }
    // ── 1. Encontrar nodo raíz ──────────────────────────────
    const startNode =
        nodes.find(n => n.type === 'oval' && /inicio/i.test(n.label)) ??
        nodes.find(n => n.type === 'oval') ??
        nodes[0];
    // ── 2. BFS topológico ────────────────────────────────────
    // Construir mapa de adyacencia: nodeId → lista ordenada de hijos
    // (s=main, e=else branch)
    const adjMap = new Map<number, Array<{ id: number; fromPort: string; toPort: string }>>();
    nodes.forEach(n => adjMap.set(n.id, []));
    connections.forEach(c => {
        const list = adjMap.get(c.from);
        if (list) list.push({ id: c.to, fromPort: c.fromPort, toPort: c.toPort });
    });
    const visited = new Set<number>();
    const order: NodeDef[] = [];
    const queue: number[] = [startNode.id];
    visited.add(startNode.id);
    while (queue.length > 0) {
        const curr = queue.shift()!;
        const nd = nodes.find(n => n.id === curr);
        if (nd) order.push(nd);
        const children = adjMap.get(curr) ?? [];
        // ordenar: puerto 's' (sur / main) primero, luego 'e'/'w'
        children.sort((a, b) => {
            const rank = (p: string) => p === 's' ? 0 : p === 'n' ? 1 : p === 'e' ? 2 : 3;
            return rank(a.fromPort) - rank(b.fromPort);
        });
        for (const child of children) {
            if (!visited.has(child.id)) {
                visited.add(child.id);
                queue.push(child.id);
            }
        }
    }
    // Añadir nodos no alcanzados (sin conexión al root)
    nodes.forEach(n => { if (!visited.has(n.id)) order.push(n); });
    // ── 3. Traducción de nodos a código RE ───────────────────
    const lines: string[] = [];
    let indent = 0;
    let programOpened = false;
    let ifDepth = 0;  // rastrear depth para cerrar if correctamente
    const pad = () => '  '.repeat(indent);
    for (let i = 0; i < order.length; i++) {
        const nd = order[i];
        const label = nd.label.trim();
        switch (nd.type) {
            /* ── OVAL: INICIO o FIN ── */
            case 'oval':
            case 'term': {
                if (/fin/i.test(label) || /end/i.test(label)) {
                    // Cerrar bloques if abiertos
                    while (ifDepth > 0) { indent--; lines.push(pad() + '}'); ifDepth--; }
                    if (programOpened) { indent = 0; lines.push('}'); }
                    programOpened = false;
                } else {
                    // INICIO → encabezado program
                    const progName = label.replace(/[^a-zA-Z0-9_]/g, '') || 'Principal';
                    lines.push(`program ${progName} {`);
                    indent = 1;
                    programOpened = true;
                }
                break;
            }
            /* ── RECT: PROCESO (declaración / asignación) ── */
            case 'rect': {
                // Si el label tiene el patrón "tipo var = expr" → declaración
                const declMatch = label.match(/^(int|double|string|bool)\s+(\w+)\s*=\s*(.+)$/i);
                if (declMatch) {
                    lines.push(`${pad()}${declMatch[1]} ${declMatch[2]} = ${declMatch[3]};`);
                } else {
                    // Intentar detectar asignación simple "var = expr"
                    const assignMatch = label.match(/^(\w+)\s*=\s*(.+)$/);
                    if (assignMatch) {
                        lines.push(`${pad()}${assignMatch[1]} = ${assignMatch[2]};`);
                    } else {
                        // Emitir como comentario con la etiqueta
                        lines.push(`${pad()}// ${label}`);
                    }
                }
                break;
            }
            /* ── DIAMOND: DECISIÓN (if) ── */
            case 'diamond': {
                // Limpiar signos de interrogación del label para usarlo como condición
                const cond = label.replace(/[¿?]/g, '').trim() || 'condicion';
                lines.push(`${pad()}if (${cond}) {`);
                indent++;
                ifDepth++;
                // Buscar hijo por puerto 's' (then) vs 'e'/'w' (else)
                // La generación de else la haremos después de insertar los children del then
                // Insertar placeholder para else si existe una rama alternativa
                const children = adjMap.get(nd.id) ?? [];
                const hasElse = children.some(c => c.fromPort === 'e' || c.fromPort === 'w');
                if (hasElse) {
                    // Marcar cierre de if con else en el próximo nodo
                    // Buscamos el primer nodo por puerto 'e'/'w' y lo anotamos
                    const elseChild = children.find(c => c.fromPort === 'e' || c.fromPort === 'w');
                    const elseNode = elseChild ? nodes.find(n => n.id === elseChild.id) : null;
                    if (elseNode) {
                        // Añadir cierre de then + else a continuación
                        // Para simplicidad, emitimos else { ... } usando el label del nodo else
                        lines.push(`${pad()}// rama then`);
                        indent--;
                        ifDepth--;
                        lines.push(`${pad()}} else {`);
                        indent++;
                        lines.push(`${pad()}// ${elseNode.label}`);
                        indent--;
                        lines.push(`${pad()}}`);
                    } else {
                        indent--;
                        ifDepth--;
                        lines.push(`${pad()}}`);
                    }
                }
                break;
            }
            /* ── PARA / IO: ENTRADA / SALIDA ── */
            case 'para':
            case 'io': {
                const isInput = /^(leer|read|input|entrada|dato)/i.test(label);
                if (isInput) {
                    // Extraer nombre de variable del label si posible: "LEER nombre" → nombre
                    const varName = label.replace(/^(leer|read|input|entrada|dato)\s*/i, '').replace(/[^a-zA-Z0-9_]/g, '') || 'dato';
                    lines.push(`${pad()}string ${varName} = input("${label}: ");`);
                } else {
                    // Salida: print
                    const content = label.replace(/^(print|salida|output|mostrar)\s*/i, '').trim();
                    if (content) {
                        lines.push(`${pad()}print("${content}");`);
                    } else {
                        lines.push(`${pad()}print("${label}");`);
                    }
                }
                break;
            }
            default:
                lines.push(`${pad()}// [${nd.type}] ${label}`);
        }
    }
    // Cerrar bloque program si quedó abierto
    while (ifDepth > 0) { indent--; lines.push(pad() + '}'); ifDepth--; }
    if (programOpened) lines.push('}');
    const code = lines.join('\n');
    // ── 4. Volcar en el editor y cambiar a vista CODE ────────
    setView('code');
    setCode(code);
    setSyncStatus('ok', 'BP→RE ✓');
    showToast('Código generado desde el diagrama ✓');
    // Lanzar lint tras 600ms para que Tauri procese el cambio
    if (lintDebounce !== null) clearTimeout(lintDebounce);
    lintDebounce = setTimeout(runLint, 600);
}
/* ─────────────────────────────────────────────────────────
   B) reToBlueprint() — Parser RE → Blueprint
   Parsea el código del editor línea a línea usando regex y
   reconstruye los nodos en el canvas. Los nodos se encadenan
   secuencialmente; la rama else del if genera un nodo
   diamond con dos salidas.
   ───────────────────────────────────────────────────────── */
function reToBlueprint(): void {
    const code = editor.getValue();
    if (!code.trim()) {
        showToast('El editor está vacío. Escribe código RE primero.');
        return;
    }
    // Limpiar canvas actual
    if (nodes.length > 0 && !confirm('¿Reemplazar el diagrama actual con el código del editor?')) return;
    saveHistory();
    nodes = [];
    connections = [];
    nodeIdCounter = 0;
    selectedNode = null;
    bpNodes.innerHTML = '';
    drawConnections();
    // ── Regex de detección ────────────────────────────────────
    const reProgram   = /^\s*program\s+(\w+)\s*\{/;
    const reCloseBrace= /^\s*\}/;
    const reIf        = /^\s*if\s*\((.+?)\)\s*\{/;
    const reElse      = /^\s*\}\s*else\s*\{/;
    const rePrint     = /^\s*print\s*\((.+)\)\s*;/;
    const reInput     = /^\s*(\w+)\s+(\w+)\s*=\s*input\s*\((.+?)\)\s*;/;
    const reDecl      = /^\s*(int|double|string|bool)\s+(\w+)\s*=\s*(.+?)\s*;/;
    const reAssign    = /^\s*(\w+)\s*=\s*(.+?)\s*;/;
    const reComment   = /^\s*\/\/(.+)/;
    const COLORS: Record<string, string> = {
        oval:    '#b8c3ff',
        rect:    '#a8e6cf',
        diamond: '#ffe082',
        para:    '#ffb59b',
    };
    // Layout automático: posicionamos en cascada vertical
    let layoutY = 80;
    const CX = 380;  // centro X
    const GAP = 130;
    /** Crea un nodo y devuelve su id, con posición automática */
    function addNode(type: string, label: string, color?: string): NodeDef {
        const def = NODE_DEFAULTS[type] || NODE_DEFAULTS.rect;
        const nd: NodeDef = {
            id: ++nodeIdCounter,
            type, label,
            x: CX - def.w / 2,
            y: layoutY,
            w: def.w,
            h: def.h,
            color: color ?? COLORS[type] ?? '#b8c3ff',
        };
        nodes.push(nd);
        layoutY += def.h + GAP - 70;
        return nd;
    }
    /** Crea una conexión entre dos nodos */
    function addConn(fromId: number, fromPort: string, toId: number, toPort: string) {
        connections.push({ from: fromId, fromPort, to: toId, toPort, id: ++nodeIdCounter });
    }
    // ── Parsear código línea a línea ─────────────────────────
    const lines = code.split('\n');
    let prevNodeId: number | null = null;
    let inElse = false;
    let elseAnchorId: number | null = null; // diamond que abre el if
    for (const rawLine of lines) {
        const line = rawLine;
        let nd: NodeDef | null = null;
        if (reProgram.test(line)) {
            const m = line.match(reProgram)!;
            nd = addNode('oval', m[1], '#b8c3ff');
        } else if (reCloseBrace.test(line) && !reElse.test(line)) {
            // Cierre de bloque: puede ser fin de program o de if
            const isLastBrace = lines.slice(lines.indexOf(line) + 1).every((l: string) => !l.trim() || l.trim() === '}');
            if (isLastBrace || lines.filter((l: string) => l.trim() === '}').length <= 1) {
                nd = addNode('oval', 'FIN', '#ffb4ab');
            }
            inElse = false;
            elseAnchorId = null;
        } else if (reIf.test(line)) {
            const m = line.match(reIf)!;
            const cond = m[1].trim();
            nd = addNode('diamond', `¿${cond}?`, COLORS.diamond);
            elseAnchorId = nd.id;
        } else if (reElse.test(line)) {
            inElse = true;
            // No crear nodo nuevo; las instrucciones dentro del else
            // se conectarán por el puerto 'e' del diamond
            continue;
        } else if (rePrint.test(line)) {
            const m = line.match(rePrint)!;
            const arg = m[1].trim().replace(/^["']|["']$/g, '');
            nd = addNode('para', `PRINT ${arg}`, COLORS.para);
        } else if (reInput.test(line)) {
            const m = line.match(reInput)!;
            nd = addNode('para', `LEER ${m[2]}`, COLORS.para);
        } else if (reDecl.test(line)) {
            const m = line.match(reDecl)!;
            nd = addNode('rect', `${m[1]} ${m[2]} = ${m[3]}`, COLORS.rect);
        } else if (reAssign.test(line)) {
            const m = line.match(reAssign)!;
            nd = addNode('rect', `${m[1]} = ${m[2]}`, COLORS.rect);
        } else if (reComment.test(line)) {
            const m = line.match(reComment)!;
            const txt = m[1].trim();
            if (txt && !/rama then|rama else/i.test(txt)) {
                nd = addNode('rect', txt, '#c3c7cd');
            }
        }
        // Conectar con el nodo anterior
        if (nd) {
            if (prevNodeId !== null) {
                if (inElse && elseAnchorId !== null) {
                    addConn(elseAnchorId, 'e', nd.id, 'w');
                    inElse = false;
                    elseAnchorId = null;
                } else {
                    addConn(prevNodeId, 's', nd.id, 'n');
                }
            }
            prevNodeId = nd.id;
        }
    }
    // ── Renderizar resultado ─────────────────────────────────
    nodes.forEach(n => renderNode(n));
    drawConnections();
    updateStats();
    setView('flow');
    setSyncStatus('ok', 'RE→BP ✓');
    showToast('Diagrama generado desde el código ✓');
}

/* ── INIT ── */
setTimeout(() => {
    resizeBpCanvas();
    addDemoNodes();
}, 100);

console.log('%c🔧 LOGOS IDE %cListo',
    'color:#b8c3ff;font-size:16px;font-weight:bold;',
    'color:#e2e1ef;');
console.log('%c📐 Panel lateral %credimensionable %c| %c🖱️ Arrastra el borde derecho',
    'color:#ffb59b;', 'color:#e2e1ef;', 'color:#8e90a2;', 'color:#c4c5d9;');
console.log('%c📏 Consola %credimensionable %c| %c🖱️ Arrastra el borde superior de SALIDA',
    'color:#ffb59b;', 'color:#e2e1ef;', 'color:#8e90a2;', 'color:#c4c5d9;');
console.log('%c🧩 Figuras %carrastrables desde la Caja de Herramientas al lienzo',
    'color:#a8e6cf;', 'color:#e2e1ef;');

// Exponer funciones globales para controladores de eventos HTML inline
(window as any).setTool = setTool;
(window as any).undo = undo;
(window as any).clearCanvas = clearCanvas;
(window as any).autoLayout = autoLayout;
(window as any).changeZoom = changeZoom;
(window as any).toggleSection = toggleSection;
(window as any).exportSVG = exportSVG;
(window as any).updateLabel = updateLabel;
(window as any).runCode = runCode;
(window as any).loadDirectory = loadDirectory;
(window as any).openFile = openFile;
(window as any).saveCurrentFile = saveCurrentFile;

// Hito 5
(window as any).blueprintToRE = blueprintToRE;
(window as any).reToBlueprint = reToBlueprint;