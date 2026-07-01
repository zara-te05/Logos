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

        // Detectar si el texto es un prompt de input() (línea que termina sin \n o es pregunta)
        // El intérprete de RE imprime el prompt de input() directamente en stdout
        // con el texto que el usuario pasó como argumento.
        const cls = is_stderr ? 'out-err' : 'out-text';
        appendLine(text, cls);

        // Si es stderr con error RE conocido, colorear diferente
        if (is_stderr && (text.includes('[RE]') || text.includes('[SyntaxError]') ||
            text.includes('[TypeCheckError]') || text.includes('[LexerError]') ||
            text.includes('[RE Runtime Error]'))) {
            // ya está en out-err
        }

        // Mostrar input interactivo si la línea parece ser un prompt de input()
        // El intérprete RE imprime el mensaje de input() antes de bloquearse en stdin.
        // Heurística: si la línea no contiene error y no termina en puntuación de cierre,
        // probablemente sea un prompt. Esto es una heurística básica.
        // Mejora futura: protocolo explícito entre el intérprete y el editor.
        if (!is_stderr && isRunning) {
            showTermInput();
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