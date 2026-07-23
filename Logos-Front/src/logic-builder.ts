import "./logic-builder.css";

/* ════════════════════════════════
   LOGIC BUILDER — Módulo RE Visual
   Hito RE-RAPTOR: Constructor de bloques tipo "Lego"
   ════════════════════════════════ */

declare const ace: any;

// ─── Tipos ───────────────────────────────────────────

export type LBNodeType =
    | 'program_main'
    | 'declare'
    | 'assign'
    | 'print'
    | 'condition';

export interface LBNode {
    id: string;
    type: LBNodeType;
    code: string;          // Código RE dentro de la cajita
    label: string;         // Label visible en la cajita
    children?: {
        yes: LBNode[];
        no: LBNode[];
    };
}

// ─── Estado global del módulo ─────────────────────────

let memoryNodes: LBNode[] = [];
let codeNodes: LBNode[] = [];
let drawerEditor: any = null;
let drawerTargetId: string | null = null;
let nodeIdCounter = 0;

// ─── Helpers ─────────────────────────────────────────

function genId(): string {
    return `lb-node-${++nodeIdCounter}`;
}

function escHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Extrae nombres de variables de una expresión RE (removiendo primero literales de texto entre comillas) */
function getVariablesFromExpression(expr: string): string[] {
    // 1. Eliminar textos entre comillas dobles o simples
    const cleanExpr = expr.replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '');

    // 2. Identificadores que NO son variables de usuario: keywords + built-ins del lenguaje RE
    const builtins = [
        // Palabras reservadas
        'int', 'double', 'string', 'bool', 'var',
        'if', 'else', 'while', 'do', 'for', 'in', 'return',
        'true', 'false', 'and', 'or', 'not', 'program',
        // Funciones built-in RE
        'print', 'input',
        'to_str', 'to_int', 'to_double', 'to_bool',
        'len', 'size',
        // Math built-ins comunes
        'sqrt', 'abs', 'round', 'floor', 'ceil', 'pow', 'max', 'min',
        // String built-ins comunes
        'substr', 'indexOf', 'toUpper', 'toLower', 'concat', 'trim',
    ];
    const matches = cleanExpr.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
    return Array.from(new Set(matches.filter(m => !builtins.includes(m))));
}

/** Retorna mapa de variables declaradas y sus tipos */
function getDeclaredVarsMap(): Map<string, string> {
    const map = new Map<string, string>();
    memoryNodes.forEach(n => {
        const m = n.code.match(/^\s*(int|double|string|bool|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
        if (m) map.set(m[2], m[1]);
    });
    return map;
}

/** Valida la compatibilidad de un valor/expresión contra un tipo de dato esperado */
function validateValueType(targetType: string, valStr: string): { ok: boolean; msg: string } {
    valStr = valStr.trim();
    if (!valStr) return { ok: false, msg: "El valor no puede estar vacío." };

    const isStringLiteral = /^"[^"]*"$/.test(valStr) || /^'[^']*'$/.test(valStr);
    const isIntegerLiteral = /^-?\d+$/.test(valStr);
    const isFloatLiteral = /^-?\d+\.\d+$/.test(valStr);
    const isNumericLiteral = isIntegerLiteral || isFloatLiteral;
    const isBoolLiteral = valStr === 'true' || valStr === 'false';

    // Detección de funciones de conversión RE
    const isToStrCall    = /^\s*to_str\s*\(.*?\)\s*$/i.test(valStr);
    const isToIntCall    = /^\s*to_int\s*\(.*?\)\s*$/i.test(valStr);
    const isToDoubleCall = /^\s*to_double\s*\(.*?\)\s*$/i.test(valStr);
    const isToBoolCall   = /^\s*to_bool\s*\(.*?\)\s*$/i.test(valStr);

    if (targetType === 'string') {
        if (isToIntCall) return { ok: false, msg: `Error de tipo: 'to_int()' devuelve un 'int', pero la variable es de tipo 'string'. Usa 'to_str()'.` };
        if (isToDoubleCall) return { ok: false, msg: `Error de tipo: 'to_double()' devuelve un 'double', pero la variable es de tipo 'string'. Usa 'to_str()'.` };
        if (isToBoolCall) return { ok: false, msg: `Error de tipo: 'to_bool()' devuelve un 'bool', pero la variable es de tipo 'string'. Usa 'to_str()'.` };
        if (isToStrCall) return { ok: true, msg: '' };
        if (isNumericLiteral) {
            return {
                ok: false,
                msg: `Error de tipo: Se esperaba 'string', pero se ingresó el número (${valStr}). Usa to_str(${valStr}) o ponlo entre comillas: "${valStr}".`
            };
        }
        if (isBoolLiteral) {
            return {
                ok: false,
                msg: `Error de tipo: Se esperaba 'string', pero se ingresó un booleano (${valStr}). Usa to_str(${valStr}) o ponlo entre comillas.`
            };
        }
    }

    if (targetType === 'int') {
        if (isToStrCall) return { ok: false, msg: `Error de tipo: 'to_str()' devuelve un 'string', pero la variable es de tipo 'int'. Usa 'to_int()'.` };
        if (isToDoubleCall) return { ok: false, msg: `Error de tipo: 'to_double()' devuelve un 'double', pero la variable es de tipo 'int'. Usa 'to_int()'.` };
        if (isToIntCall) return { ok: true, msg: '' };
        if (isStringLiteral) {
            return {
                ok: false,
                msg: `Error de tipo: Se esperaba 'int', pero se ingresó texto entre comillas (${valStr}). Usa to_int(${valStr}).`
            };
        }
        if (isFloatLiteral) {
            return {
                ok: false,
                msg: `Error de tipo: Se esperaba 'int' (entero), pero se ingresó un número decimal (${valStr}). Usa to_int(${valStr}).`
            };
        }
        if (isBoolLiteral) {
            return {
                ok: false,
                msg: `Error de tipo: Se esperaba 'int', pero se ingresó un valor booleano (${valStr}).`
            };
        }
    }

    if (targetType === 'double') {
        if (isToStrCall) return { ok: false, msg: `Error de tipo: 'to_str()' devuelve un 'string', pero la variable es de tipo 'double'. Usa 'to_double()'.` };
        if (isToDoubleCall) return { ok: true, msg: '' };
        if (isStringLiteral) {
            return {
                ok: false,
                msg: `Error de tipo: Se esperaba 'double', pero se ingresó texto entre comillas (${valStr}). Usa to_double(${valStr}).`
            };
        }
        if (isBoolLiteral) {
            return {
                ok: false,
                msg: `Error de tipo: Se esperaba 'double', pero se ingresó un valor booleano (${valStr}).`
            };
        }
    }

    if (targetType === 'bool') {
        if (isToStrCall) return { ok: false, msg: `Error de tipo: 'to_str()' devuelve un 'string', pero la variable es de tipo 'bool'. Usa 'to_bool()'.` };
        if (isToBoolCall) return { ok: true, msg: '' };
        if (isStringLiteral) {
            return {
                ok: false,
                msg: `Error de tipo: Se esperaba 'bool', pero se ingresó texto entre comillas (${valStr}).`
            };
        }
        if (isNumericLiteral) {
            return {
                ok: false,
                msg: `Error de tipo: Se esperaba 'bool' (true/false o comparación), pero se ingresó un número (${valStr}).`
            };
        }
    }

    return { ok: true, msg: '' };
}

/** Validador sintáctico y semántico general para nodos RE */
export function validateNodeCode(type: LBNodeType, code: string): { ok: boolean; msg: string } {
    const trimmed = code.trim();
    if (!trimmed) return { ok: false, msg: "El código no puede estar vacío." };
    if (type === 'program_main') return { ok: true, msg: '' };

    if (type === 'declare') {
        const match = trimmed.match(/^\s*(int|double|string|bool|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+?);?\s*$/);
        if (!match) {
            return {
                ok: false,
                msg: 'Sintaxis inválida. Ejemplo: string nombre = "RE"; o int total = 0;'
            };
        }

        const dtype = match[1];
        const varName = match[2];
        const rawVal = match[3].trim();

        const reserved = ['int', 'double', 'string', 'bool', 'var', 'if', 'else', 'print', 'input', 'true', 'false', 'and', 'or', 'not', 'program'];
        if (reserved.includes(varName)) {
            return { ok: false, msg: `'${varName}' es una palabra reservada del lenguaje.` };
        }

        return validateValueType(dtype, rawVal);
    }

    if (type === 'assign') {
        const match = trimmed.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+?);?\s*$/);
        if (!match) {
            return {
                ok: false,
                msg: 'Sintaxis inválida. Formato: variable = expresión; (ej: x = z + 5;)'
            };
        }

        const destVar = match[1];
        const expr = match[2].trim();
        const declaredVars = getDeclaredVarsMap();

        if (!declaredVars.has(destVar)) {
            return {
                ok: false,
                msg: `La variable '${destVar}' no ha sido declarada en la Región de Memoria.`
            };
        }

        const usedVars = getVariablesFromExpression(expr);
        for (const v of usedVars) {
            if (!declaredVars.has(v)) {
                return {
                    ok: false,
                    msg: `La variable '${v}' no ha sido declarada en la Región de Memoria.`
                };
            }
        }

        const targetType = declaredVars.get(destVar)!;
        return validateValueType(targetType, expr);
    }

    if (type === 'print') {
        let expr = trimmed;
        const pMatch = trimmed.match(/^\s*print\s*\(\s*([\s\S]+?)\s*\)\s*;?\s*$/i);
        if (pMatch) {
            expr = pMatch[1].trim();
        } else {
            expr = trimmed.replace(/;$/, '').trim();
        }
        if (!expr) return { ok: false, msg: 'Debe ingresar una expresión para mostrar en pantalla.' };

        const declared = Array.from(getDeclaredVarsMap().keys());
        const usedVars = getVariablesFromExpression(expr);
        for (const v of usedVars) {
            if (!declared.includes(v)) {
                return {
                    ok: false,
                    msg: `La variable '${v}' no ha sido declarada en la Región de Memoria.`
                };
            }
        }
        return { ok: true, msg: '' };
    }

    if (type === 'condition') {
        let expr = trimmed.replace(/^\s*if\s*\(\s*/i, '').replace(/\s*\)\s*$/, '').replace(/;$/, '').trim();
        if (!expr) return { ok: false, msg: 'La condición no puede estar vacía.' };

        const declared = Array.from(getDeclaredVarsMap().keys());
        const usedVars = getVariablesFromExpression(expr);
        for (const v of usedVars) {
            if (!declared.includes(v)) {
                return {
                    ok: false,
                    msg: `La variable '${v}' usada en la condición no ha sido declarada en la Región de Memoria.`
                };
            }
        }
        return { ok: true, msg: '' };
    }

    return { ok: true, msg: '' };
}

function validateNode(node: LBNode): { ok: boolean; msg: string } {
    return validateNodeCode(node.type, node.code);
}

// ─── Parsers visuales por tipo ────────────────────────

/** Parsea declaración: "int suma = 5;" → {dtype, name, value} */
function parseDeclare(code: string): { dtype: string; name: string; value: string } {
    const m = code.match(/^\s*(int|double|string|bool|var)\s+(\w+)\s*=\s*(.+?);?\s*$/);
    if (m) return { dtype: m[1], name: m[2], value: m[3].trim() };
    const m2 = code.match(/^\s*(\w+)\s*=\s*(.+?);?\s*$/);
    if (m2) return { dtype: 'var', name: m2[1], value: m2[2].trim() };
    return { dtype: 'var', name: code.trim(), value: '' };
}

/** Parsea asignación: "x = z + c;" → {dest, expr} */
function parseAssign(code: string): { dest: string; expr: string } {
    const m = code.match(/^\s*(\w+)\s*=\s*(.+?);?\s*$/);
    if (m) return { dest: m[1], expr: m[2].trim() };
    return { dest: '?', expr: code.trim() };
}

/** Parsea print: "print(expr);" → expr */
function parsePrint(code: string): string {
    const m = code.match(/^\s*print\s*\(\s*([\s\S]*?)\s*\)\s*;?\s*$/i);
    return m ? m[1].trim() : code.trim();
}

/** Color badge por tipo de dato */
function dtypeColor(dtype: string): string {
    const map: Record<string, string> = {
        int: '#7dd3fc', double: '#93c5fd', string: '#f0abfc',
        bool: '#86efac', var: '#fca5a5'
    };
    return map[dtype] || '#a0aec0';
}

// ─── Render de nodos ─────────────────────────────────

function renderNode(node: LBNode, _isMemory: boolean): HTMLElement {
    const el = document.createElement('div');
    el.className = `lb-node lb-node-${node.type}`;
    el.setAttribute('data-node-id', node.id);

    const actions = node.type !== 'program_main'
        ? `<div class="lb-node-actions">
              <button class="lb-node-edit-btn" data-id="${node.id}" title="Editar (doble clic)">EDIT</button>
              <button class="lb-node-del-btn" data-id="${node.id}" title="Eliminar">X</button>
           </div>`
        : '';

    const validation = validateNode(node);
    if (!validation.ok) el.classList.add('lb-node-error');

    const errTip = !validation.ok
        ? `<div class="lb-error-tooltip">${escHtml(validation.msg)}</div>` : '';

    switch (node.type) {

        // ── DECLARACIÓN ──────────────────────────────
        case 'declare': {
            const { dtype, name, value } = parseDeclare(node.code);
            const dc = dtypeColor(dtype);
            el.innerHTML = `
                <div class="lb-shape-declare">
                    <span class="lb-badge" style="background:${dc}20;color:${dc};border-color:${dc}40">${escHtml(dtype)}</span>
                    <span class="lb-var-name">${escHtml(name)}</span>
                    ${value ? `<span class="lb-eq">=</span><span class="lb-var-val">${escHtml(value)}</span>` : ''}
                </div>
                ${actions}${errTip}`;
            break;
        }

        // ── ASIGNACIÓN ───────────────────────────────
        case 'assign': {
            const { dest, expr } = parseAssign(node.code);
            el.innerHTML = `
                <div class="lb-shape-assign">
                    <span class="lb-var-dest">${escHtml(dest)}</span>
                    <span class="lb-eq">←</span>
                    <span class="lb-expr">${escHtml(expr)}</span>
                </div>
                ${actions}${errTip}`;
            break;
        }

        // ── PRINT ────────────────────────────────────
        case 'print': {
            const arg = parsePrint(node.code);
            el.innerHTML = `
                <div class="lb-shape-print">
                    <span class="lb-print-ico">OUT</span>
                    <span class="lb-print-arg">${escHtml(arg)}</span>
                </div>
                ${actions}${errTip}`;
            break;
        }

        // ── CONDICIONAL ──────────────────────────────
        case 'condition': {
            el.innerHTML = `
                <div class="lb-if-header">
                    <div class="lb-diamond-wrap">
                        <div class="lb-diamond">
                            <span class="lb-diamond-text">${escHtml(node.code || 'condición')}</span>
                        </div>
                    </div>
                    <div class="lb-node-actions">
                        <button class="lb-node-edit-btn" data-id="${node.id}" title="Editar condición">EDIT</button>
                        <button class="lb-node-del-btn" data-id="${node.id}" title="Eliminar">X</button>
                    </div>
                </div>
                <div class="lb-if-branches">
                    <div class="lb-branch branch-yes" data-parent="${node.id}" data-branch="yes">
                        ${(node.children?.yes || []).map(c => renderNode(c, false).outerHTML).join('')}
                    </div>
                    <div class="lb-branch branch-no" data-parent="${node.id}" data-branch="no">
                        ${(node.children?.no || []).map(c => renderNode(c, false).outerHTML).join('')}
                    </div>
                </div>`;
            break;
        }

        // ── PROGRAM MAIN ─────────────────────────────
        case 'program_main':
        default: {
            el.innerHTML = `
                <div class="lb-shape-oval">
                    <span class="lb-main-ico">MAIN</span>
                    <span class="lb-node-code">Principal</span>
                </div>`;
            break;
        }
    }

    return el;
}

// ─── Re-render completo ───────────────────────────────

function rerenderRegions() {
    // Región de Memoria
    const memZone = document.getElementById('lb-memory-zone');
    if (memZone) {
        // Ocultar placeholder si hay elementos
        const placeholder = memZone.querySelector('.lb-zone-placeholder') as HTMLElement | null;
        if (placeholder) {
            placeholder.style.display = memoryNodes.length > 0 ? 'none' : 'flex';
        }

        // Limpiar y dejar solo los nodos
        const existing = memZone.querySelectorAll('.lb-node');
        existing.forEach(e => e.remove());
        memoryNodes.forEach(n => memZone.appendChild(renderNode(n, true)));
    }

    // Región de Código
    const codeZone = document.getElementById('lb-code-zone');
    if (codeZone) {
        // También tiene placeholder o no
        const placeholder = codeZone.querySelector('.lb-zone-placeholder') as HTMLElement | null;
        if (placeholder) {
            placeholder.style.display = codeNodes.length > 0 ? 'none' : 'flex';
        }

        const existing2 = codeZone.querySelectorAll('.lb-node');
        existing2.forEach(e => e.remove());
        codeNodes.forEach(n => codeZone.appendChild(renderNode(n, false)));
    }

    attachNodeEvents();
    updateGeneratedCode();
}

// ─── Eventos de nodos (editar / eliminar) ────────────

function attachNodeEvents() {
    // Botones de edición
    document.querySelectorAll('.lb-node-edit-btn').forEach(btn => {
        (btn as HTMLElement).onclick = (e) => {
            e.stopPropagation();
            const id = (btn as HTMLElement).getAttribute('data-id')!;
            openDrawer(id);
        };
    });

    // Botones de eliminación
    document.querySelectorAll('.lb-node-del-btn').forEach(btn => {
        (btn as HTMLElement).onclick = (e) => {
            e.stopPropagation();
            const id = (btn as HTMLElement).getAttribute('data-id')!;
            deleteNode(id);
        };
    });

    // Doble clic en nodo
    document.querySelectorAll('.lb-node').forEach(nodeEl => {
        (nodeEl as HTMLElement).ondblclick = (e) => {
            const id = (nodeEl as HTMLElement).getAttribute('data-node-id');
            if (id) openDrawer(id);
            e.stopPropagation();
        };
    });

    // Configurar zonas de drop para ramas condicionales
    setupBranchDropZones();
}

function deleteNode(id: string) {
    memoryNodes = memoryNodes.filter(n => n.id !== id);
    codeNodes = codeNodes.filter(n => n.id !== id);
    // También buscar en hijos de condiciones
    codeNodes = codeNodes.map(n => removeFromCondition(n, id));
    rerenderRegions();
}

function removeFromCondition(node: LBNode, id: string): LBNode {
    if (node.type === 'condition' && node.children) {
        node.children.yes = node.children.yes
            .filter(c => c.id !== id)
            .map(c => removeFromCondition(c, id));
        node.children.no = node.children.no
            .filter(c => c.id !== id)
            .map(c => removeFromCondition(c, id));
    }
    return node;
}

function findNode(id: string, list: LBNode[]): LBNode | null {
    for (const n of list) {
        if (n.id === id) return n;
        if (n.type === 'condition' && n.children) {
            const found = findNode(id, [...n.children.yes, ...n.children.no]);
            if (found) return found;
        }
    }
    return null;
}

// ─── Paleta de bloques (toolbar) ─────────────────────

function createPaletteBlock(type: LBNodeType, label: string, hint: string): HTMLElement {
    const el = document.createElement('div');
    el.className = `lb-palette-block lb-palette-${type}`;
    el.setAttribute('draggable', 'true');
    el.setAttribute('data-type', type);
    el.title = hint + ' — Arrastra a una zona o CLIC para agregar';
    el.innerHTML = `<span class="lb-palette-label">${label}</span>`;

    // ── Drag ──
    el.addEventListener('dragstart', (e) => {
        e.dataTransfer!.setData('lb/type', type);   // clave específica
        e.dataTransfer!.setData('text/plain', type); // fallback
        e.dataTransfer!.effectAllowed = 'copy';
        el.classList.add('lb-palette-dragging');
    });
    el.addEventListener('dragend', () => {
        el.classList.remove('lb-palette-dragging');
    });

    // ── Clic: agrega directo a la zona correcta ──
    el.addEventListener('click', () => {
        const isMemoryType = type === 'declare';
        addNodeToZone(type, isMemoryType);
    });

    return el;
}

// ─── Drag & Drop en zonas ─────────────────────────────

function setupDropZone(zoneId: string, isMemory: boolean) {
    const zone = document.getElementById(zoneId);
    if (!zone) return;

    zone.addEventListener('dragover', (e) => {
        // Solo aceptar si viene de la paleta RE
        if (e.dataTransfer!.types.includes('lb/type') ||
            e.dataTransfer!.types.includes('text/plain')) {
            e.preventDefault();
            e.dataTransfer!.dropEffect = 'copy';
            zone.classList.add('lb-zone-dragover');
        }
    });

    // Fix dragleave: ignorar si el cursor va a un hijo de la zona
    zone.addEventListener('dragleave', (e) => {
        const related = (e as DragEvent).relatedTarget as Node | null;
        if (!related || !zone.contains(related)) {
            zone.classList.remove('lb-zone-dragover');
        }
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.remove('lb-zone-dragover');
        const type = (e.dataTransfer!.getData('lb/type') ||
                      e.dataTransfer!.getData('text/plain')) as LBNodeType;
        if (type) addNodeToZone(type, isMemory);
    });
}

// ─── Drop en ramas SÍ/NO ──────────────────────────────

function setupBranchDropZones() {
    document.querySelectorAll('.lb-branch').forEach(branchEl => {
        const el = branchEl as HTMLElement;
        // Evitar doble-registro
        if (el.dataset.dndReady === '1') return;
        el.dataset.dndReady = '1';

        const parentId = el.getAttribute('data-parent')!;
        const branch   = el.getAttribute('data-branch') as 'yes' | 'no';

        el.addEventListener('dragover', (e) => {
            if (e.dataTransfer!.types.includes('lb/type') ||
                e.dataTransfer!.types.includes('text/plain')) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer!.dropEffect = 'copy';
                el.classList.add('lb-zone-dragover');
            }
        });

        el.addEventListener('dragleave', (e) => {
            const related = (e as DragEvent).relatedTarget as Node | null;
            if (!related || !el.contains(related)) {
                el.classList.remove('lb-zone-dragover');
            }
        });

        el.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            el.classList.remove('lb-zone-dragover');
            const type = (e.dataTransfer!.getData('lb/type') ||
                          e.dataTransfer!.getData('text/plain')) as LBNodeType;
            if (!type || type === 'declare' || type === 'program_main') {
                showLBToast('Solo se permiten operaciones, print y condiciones dentro del if/else.');
                return;
            }
            addNodeToBranch(type, parentId, branch);
        });
    });
}

/** Genera código inicial para un nodo usando las variables declaradas disponibles */
function getDefaultNodeCode(type: LBNodeType): string {
    const declared = Array.from(getDeclaredVarsMap().keys());
    const v = declared[0];
    switch (type) {
        case 'declare':      return 'int suma = 0;';
        case 'assign':       return v ? `${v} = 0;` : 'x = 0;';
        case 'print':        return v ? `print(${v});` : 'print("Hola");';
        case 'condition':    return v ? `${v} > 0` : 'true';
        case 'program_main': return 'program Principal';
    }
}

function addNodeToBranch(type: LBNodeType, parentId: string, branch: 'yes' | 'no') {
    const code = getDefaultNodeCode(type);
    const node: LBNode = { id: genId(), type, code, label: code };
    if (type === 'condition') node.children = { yes: [], no: [] };

    const insertInto = (list: LBNode[]): boolean => {
        for (const n of list) {
            if (n.id === parentId && n.children) {
                n.children[branch].push(node);
                return true;
            }
            if (n.type === 'condition' && n.children) {
                if (insertInto(n.children.yes) || insertInto(n.children.no)) return true;
            }
        }
        return false;
    };
    insertInto(codeNodes);
    rerenderRegions();
    openDrawer(node.id);
}

function addNodeToZone(type: LBNodeType, isMemory: boolean) {
    // Validar restricciones
    if (isMemory && type !== 'declare') {
        showLBToast('La Zona de Memoria solo acepta declaraciones de variables.');
        return;
    }
    if (!isMemory && type === 'declare') {
        showLBToast('Las declaraciones solo van en la Zona de Memoria.');
        return;
    }
    if (!isMemory && type === 'program_main') {
        showLBToast('El bloque Main ya está en la Zona de Ejecución.');
        return;
    }

    const code = getDefaultNodeCode(type);
    const node: LBNode = { id: genId(), type, code, label: code };

    if (type === 'condition') {
        node.children = { yes: [], no: [] };
    }

    if (isMemory) {
        memoryNodes.push(node);
    } else {
        codeNodes.push(node);
    }

    rerenderRegions();
    // Abrir drawer para edición inmediata (excepto program_main)
    if (type !== 'program_main') {
        openDrawer(node.id);
    }
}

// ─── Drawer (Modal centrado interno) ───────────────

function openDrawer(nodeId: string) {
    drawerTargetId = nodeId;

    // Buscar el nodo en ambas regiones
    const node = findNode(nodeId, [...memoryNodes, ...codeNodes]);
    if (!node) return;

    const drawer = document.getElementById('lb-drawer')!;
    const drawerTitle = document.getElementById('lb-drawer-title')!;
    const drawerHint = document.getElementById('lb-drawer-hint')!;

    const titles: Record<LBNodeType, string> = {
        declare:      'Declarar Variable',
        assign:       'Configurar Operación',
        print:        'Mostrar en Consola',
        condition:    'Configurar Condicional',
        program_main: 'Inicio del Programa'
    };

    const hints: Record<LBNodeType, string> = {
        declare:      'Ejemplo: int suma = 0; • string nombre = "RE"; • bool activo = true;',
        assign:       'Ejemplo: suma = a + b; • resultado = suma * 2;',
        print:        'Ejemplo: print(suma); • print("Hola mundo");',
        condition:    'Ejemplo: suma > 0 • nombre == "RE" • activo and suma != 0',
        program_main: 'El bloque principal no es editable.'
    };

    drawerTitle.textContent = titles[node.type];
    drawerHint.textContent = hints[node.type];

    // Inicializar o actualizar el mini-editor Ace
    if (!drawerEditor) {
        drawerEditor = ace.edit('lb-ace-editor');
        drawerEditor.setTheme('ace/theme/one_dark');
        drawerEditor.session.setMode('ace/mode/re');
        
        // Habilitar autocompletado y langTools
        if (ace.require) {
            try {
                const langTools = ace.require('ace/ext/language_tools');
                if (langTools) {
                    const varCompleter = {
                        getCompletions: (_ed: any, _sess: any, _pos: any, _prefix: any, callback: any) => {
                            const wordList: any[] = [];

                            // Variables declaradas en la Región de Memoria
                            const varsMap = getDeclaredVarsMap();
                            varsMap.forEach((dtype, name) => {
                                wordList.push({ caption: name, value: name, meta: `var (${dtype})`, score: 1200 });
                            });

                            // Funciones de conversión
                            const conversions = [
                                { caption: 'to_str',    value: 'to_str()',    note: 'convierte a string' },
                                { caption: 'to_int',    value: 'to_int()',    note: 'convierte a int' },
                                { caption: 'to_double', value: 'to_double()', note: 'convierte a double' },
                                { caption: 'to_bool',   value: 'to_bool()',   note: 'convierte a bool' },
                                { caption: 'len',       value: 'len()',       note: 'longitud' },
                                { caption: 'size',      value: 'size()',      note: 'tamaño' },
                                { caption: 'sqrt',      value: 'sqrt()',      note: 'raíz cuadrada' },
                                { caption: 'abs',       value: 'abs()',       note: 'valor absoluto' },
                                { caption: 'round',     value: 'round()',     note: 'redondear' },
                                { caption: 'floor',     value: 'floor()',     note: 'piso' },
                                { caption: 'ceil',      value: 'ceil()',      note: 'techo' },
                                { caption: 'pow',       value: 'pow(,)',      note: 'potencia' },
                                { caption: 'max',       value: 'max(,)',      note: 'máximo' },
                                { caption: 'min',       value: 'min(,)',      note: 'mínimo' },
                                { caption: 'input',     value: 'input("")',   note: 'entrada de usuario' },
                                { caption: 'print',     value: 'print()',     note: 'imprimir' },
                            ];
                            conversions.forEach(fn => {
                                wordList.push({ caption: fn.caption, value: fn.value, meta: `RE / ${fn.note}`, score: 1000 });
                            });

                            // Palabras clave del lenguaje
                            const kws = ['int', 'double', 'string', 'bool', 'var', 'true', 'false', 'and', 'or', 'not'];
                            kws.forEach(k => {
                                wordList.push({ caption: k, value: k, meta: 'palabra clave', score: 500 });
                            });

                            callback(null, wordList);
                        }
                    };
                    langTools.addCompleter(varCompleter);
                }
            } catch (e) {
                console.warn('Ace autocompletion extension warning:', e);
            }
        }

        drawerEditor.setOptions({
            fontSize: '13px',
            fontFamily: "'Space Mono', monospace",
            showPrintMargin: false,
            tabSize: 2,
            useSoftTabs: true,
            maxLines: 8,
            minLines: 3,
            wrap: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true
        });
    }

    drawerEditor.setValue(node.code, -1);
    drawerEditor.setReadOnly(node.type === 'program_main');

    // Abrir backdrop y modal en la misma pestaña
    const backdrop = document.getElementById('lb-modal-backdrop');
    if (backdrop) backdrop.classList.add('lb-backdrop-open');

    drawer.classList.add('lb-drawer-open');
    drawerEditor.focus();
}

function closeDrawer() {
    const drawer = document.getElementById('lb-drawer')!;
    drawer.classList.remove('lb-drawer-open');

    const backdrop = document.getElementById('lb-modal-backdrop');
    if (backdrop) backdrop.classList.remove('lb-backdrop-open');

    drawerTargetId = null;
}

function saveDrawer() {
    if (!drawerTargetId) return;

    const node = findNode(drawerTargetId, [...memoryNodes, ...codeNodes]);
    if (!node) return;

    let newCode = drawerEditor?.getValue()?.trim() || '';
    if (!newCode) {
        showLBToast('El código no puede estar vacío.');
        return;
    }

    // Auto-formato: normalizar código según el tipo de bloque
    if (node.type === 'print') {
        const pMatch = newCode.match(/^\s*print\s*\(\s*([\s\S]+?)\s*\)\s*;?\s*$/i);
        if (pMatch) {
            // Ya tiene print(...), asegurar punto y coma
            newCode = `print(${pMatch[1].trim()});`;
        } else {
            // El usuario escribió solo la expresión — envolver en print()
            newCode = `print(${newCode.replace(/;$/, '').trim()});`;
        }
    } else if (node.type === 'condition') {
        // Limpiar if (...) si el usuario lo escribió completo
        newCode = newCode.replace(/^\s*if\s*\(\s*/i, '').replace(/\s*\)\s*;?\s*$/, '').replace(/;$/, '').trim();
    } else if (node.type === 'declare' || node.type === 'assign') {
        if (!newCode.endsWith(';')) newCode += ';';
    }

    // VALIDACIÓN ESTRICTA: Impedir guardar si viola la gramática o tipos del lenguaje
    const validation = validateNodeCode(node.type, newCode);
    if (!validation.ok) {
        showLBToast(`Error: ${validation.msg}`);
        // NO cerrar la pestaña/modal si hay error sintáctico o de tipo!
        return;
    }

    // Actualizar nodo en memoria o código
    const updateInList = (list: LBNode[]): boolean => {
        for (const n of list) {
            if (n.id === drawerTargetId) {
                n.code = newCode;
                n.label = newCode.length > 40 ? newCode.substring(0, 37) + '…' : newCode;
                return true;
            }
            if (n.type === 'condition' && n.children) {
                if (updateInList(n.children.yes) || updateInList(n.children.no)) return true;
            }
        }
        return false;
    };

    updateInList(memoryNodes);
    updateInList(codeNodes);

    closeDrawer();
    rerenderRegions();
}

// ─── Generación de código RE ─────────────────────────

function generateRECode(): string {
    const lines: string[] = [];

    lines.push('program Principal {');

    // Las declaraciones de variables van primero, dentro del bloque program
    if (memoryNodes.length > 0) {
        memoryNodes.forEach(n => lines.push('  ' + n.code));
        if (codeNodes.filter(n => n.type !== 'program_main').length > 0) {
            lines.push('');
        }
    }

    // Instrucciones de la Región de Código (excepto program_main)
    const codeContent = codeNodes.filter(n => n.type !== 'program_main');
    codeContent.forEach(n => {
        lines.push(...nodeToCode(n, 2));
    });

    lines.push('}');
    return lines.join('\n');
}

function nodeToCode(node: LBNode, indent: number): string[] {
    const pad = ' '.repeat(indent);
    switch (node.type) {
        case 'declare':
        case 'assign':
            return [`${pad}${node.code}`];
        case 'print':
            return [`${pad}${node.code}`];
        case 'condition': {
            const lines: string[] = [`${pad}if (${node.code}) {`];
            (node.children?.yes || []).forEach(c => lines.push(...nodeToCode(c, indent + 2)));
            lines.push(`${pad}} else {`);
            (node.children?.no || []).forEach(c => lines.push(...nodeToCode(c, indent + 2)));
            lines.push(`${pad}}`);
            return lines;
        }
        default:
            return [`${pad}// ${node.code}`];
    }
}

function updateGeneratedCode() {
    const preview = document.getElementById('lb-code-preview');
    if (preview) {
        preview.textContent = generateRECode();
    }
}

// ─── Toast de notificación ───────────────────────────

function showLBToast(msg: string) {
    const t = document.getElementById('lb-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('lb-toast-show');
    setTimeout(() => t.classList.remove('lb-toast-show'), 3500);
}

// ─── Inicialización del módulo ────────────────────────

export function initLogicBuilder() {
    const container = document.getElementById('lb-container');
    if (!container) return;

    // Paleta de bloques sin emojis
    const palette = document.getElementById('lb-palette');
    if (palette) {
        const blocks: [LBNodeType, string, string][] = [
            ['declare',   'Declarar Variable', 'Crea una variable en la Zona de Memoria'],
            ['assign',    'Operación',         'Modifica o asigna un valor a una variable'],
            ['print',     'Mostrar',           'Imprime un valor en la consola'],
            ['condition', 'Condicional If',    'Bifurcación Si/No en el flujo'],
        ];
        blocks.forEach(([type, label, hint]) => {
            palette.appendChild(createPaletteBlock(type, label, hint));
        });
    }

    // Nodo Main inicial en la Región de Código
    if (codeNodes.length === 0) {
        codeNodes.push({
            id: genId(),
            type: 'program_main',
            code: 'program Principal',
            label: 'program Principal'
        });
    }

    // Setup de Drop Zones
    setupDropZone('lb-memory-zone', true);
    setupDropZone('lb-code-zone', false);

    // Botones del Drawer / Modal
    document.getElementById('lb-drawer-save')?.addEventListener('click', saveDrawer);
    document.getElementById('lb-drawer-cancel')?.addEventListener('click', closeDrawer);
    document.getElementById('lb-drawer-cancel-btn')?.addEventListener('click', closeDrawer);
    document.getElementById('lb-modal-backdrop')?.addEventListener('click', closeDrawer);

    // Botón: Copiar código generado al editor principal
    document.getElementById('lb-btn-send-to-editor')?.addEventListener('click', () => {
        const code = generateRECode();
        window.dispatchEvent(new CustomEvent('lb-send-to-editor', { detail: { code } }));
        showLBToast('Código enviado al editor principal');
    });

    // Botón: Limpiar lienzo
    document.getElementById('lb-btn-clear')?.addEventListener('click', () => {
        memoryNodes = [];
        codeNodes = [{
            id: genId(),
            type: 'program_main',
            code: 'program Principal',
            label: 'program Principal'
        }];
        rerenderRegions();
        showLBToast('Lienzo limpiado');
    });

    // Render inicial
    rerenderRegions();
}
