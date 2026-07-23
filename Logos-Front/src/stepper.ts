import "./stepper.css";

export interface StepFrame {
    lineNumber: number;         // 1-based line number
    lineText: string;           // code text
    type: 'declare' | 'assign' | 'arithmetic' | 'condition' | 'loop' | 'print' | 'input' | 'return' | 'program_start' | 'program_end' | 'none';
    variables: Record<string, { value: any; type: string; isNew?: boolean; isChanged?: boolean }>;
    description: string;
    animationType: 'block_sum' | 'block_sub' | 'block_mul' | 'block_div' | 'branch_true' | 'branch_false' | 'loop_enter' | 'loop_back' | 'assign_flow' | 'print_bubble' | 'none';
    animationData?: {
        // Aritmética
        left?: any;
        leftName?: string;      // Nombre de la variable izquierda (ej: "a")
        right?: any;
        rightName?: string;     // Nombre de la variable derecha (ej: "b")
        op?: string;            // Operador (ej: "+")
        result?: any;           // Resultado calculado
        destVar?: string;       // Variable destino (ej: "suma")
        // Asignación simple
        value?: any;
    };
    activeVariable?: string;
    conditionResult?: boolean;
    loopIteration?: number;
    nodeId?: number;            // ID del nodo del diagrama correspondiente a esta línea
}

// Helper to escape HTML characters
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Simple expression evaluator using JS evaluation safely with scoped variables
function evaluateExpression(expr: string, vars: Record<string, { value: any; type: string }>): any {
    let safeExpr = expr.trim();
    
    // Replace variable names with their actual values
    // Sort keys by length descending to avoid replacing substrings of longer names
    const sortedVarNames = Object.keys(vars).sort((a, b) => b.length - a.length);
    for (const name of sortedVarNames) {
        const val = vars[name].value;
        const valStr = typeof val === 'string' ? `"${val.replace(/"/g, '\\"')}"` : String(val);
        const regex = new RegExp(`\\b${name}\\b`, 'g');
        safeExpr = safeExpr.replace(regex, valStr);
    }

    // Replace basic RE operators with JS equivalents
    safeExpr = safeExpr.replace(/\band\b/g, '&&');
    safeExpr = safeExpr.replace(/\bor\b/g, '||');
    safeExpr = safeExpr.replace(/\bnot\b/g, '!');

    try {
        const fn = new Function(
            'to_str', 'to_int', 'to_double', 'to_bool',
            'len', 'size', 'sqrt', 'abs', 'round', 'floor', 'ceil', 'pow', 'max', 'min',
            `return (${safeExpr});`
        );
        return fn(
            (x: any) => String(x),
            (x: any) => parseInt(x, 10) || 0,
            (x: any) => parseFloat(x) || 0,
            (x: any) => Boolean(x),
            (x: any) => x?.length ?? 0,
            (x: any) => x?.length ?? 0,
            Math.sqrt, Math.abs, Math.round, Math.floor, Math.ceil, Math.pow, Math.max, Math.min
        );
    } catch (e) {
        if (safeExpr.startsWith('"') && safeExpr.endsWith('"')) {
            return safeExpr.substring(1, safeExpr.length - 1);
        }
        return safeExpr;
    }
}

export function generateSteps(code: string): StepFrame[] {
    const lines = code.split('\n');
    const steps: StepFrame[] = [];
    
    // 1. Pre-process blocks (find matching braces)
    const braceMap: Record<number, number> = {}; // openIndex -> closeIndex and vice versa
    const stack: number[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('{')) {
            stack.push(i);
        }
        if (line.includes('}')) {
            const open = stack.pop();
            if (open !== undefined) {
                braceMap[open] = i;
                braceMap[i] = open;
            }
        }
    }

    // Current state of variables
    let currentVars: Record<string, { value: any; type: string; isNew?: boolean; isChanged?: boolean }> = {};
    
    // Limits to prevent freeze
    let totalSteps = 0;
    const MAX_STEPS = 300;
    const loopCounter: Record<number, number> = {}; // lineNum -> count

    let pc = 0;
    while (pc < lines.length && totalSteps < MAX_STEPS) {
        const lineText = lines[pc].trim();
        const lineNum = pc + 1;

        if (!lineText || lineText.startsWith('//')) {
            pc++;
            continue;
        }

        // Deep copy variables state and clear temporary status
        const varsSnapshot: Record<string, { value: any; type: string; isNew?: boolean; isChanged?: boolean }> = {};
        for (const [k, v] of Object.entries(currentVars)) {
            varsSnapshot[k] = { value: v.value, type: v.type };
        }

        // Regex patterns
        const reProgram   = /^\s*program\s+(\w+)\s*\{/;
        const reIf        = /^\s*if\s*\((.+?)\)\s*\{/;
        const reElse      = /^\s*\}\s*else\s*\{/;
        const reWhile     = /^\s*while\s*\((.+?)\)\s*\{/;
        const reFor       = /^\s*for\s+(\w+)\s+in\s+(.+?)\s*\{/;
        const rePrint     = /^\s*print\s*\((.+)\)\s*;/;
        const reInput     = /^\s*(\w+)\s+(\w+)\s*=\s*input\s*\((.+?)\)\s*;/;
        const reDecl      = /^\s*(int|double|string|bool|var)\s+(\w+)\s*=\s*(.+?)\s*;/;
        const reAssign    = /^\s*(\w+)\s*(=|\+=|-=|\*=|\/=)\s*(.+?)\s*;/;

        let frame: StepFrame | null = null;

        if (reProgram.test(lineText)) {
            const m = lineText.match(reProgram)!;
            frame = {
                lineNumber: lineNum,
                lineText,
                type: 'program_start',
                variables: varsSnapshot,
                description: `Inicia el programa "${m[1]}"`,
                animationType: 'none'
            };
            pc++;
        }
        else if (reDecl.test(lineText)) {
            const m = lineText.match(reDecl)!;
            const type = m[1];
            const name = m[2];
            const expr = m[3];
            
            // Check if arithmetic animation
            let animType: StepFrame['animationType'] = 'none';
            let animationData: any = null;
            
            // Simple arithmetic parse: a + b
            const mathMatch = expr.match(/^\s*(\w+|\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\w+|\d+(?:\.\d+)?)\s*$/);
            if (mathMatch) {
                const op = mathMatch[2];
                const leftToken = mathMatch[1];
                const rightToken = mathMatch[3];
                const left = evaluateExpression(leftToken, varsSnapshot);
                const right = evaluateExpression(rightToken, varsSnapshot);
                const val = evaluateExpression(expr, varsSnapshot);
                
                animType = op === '+' ? 'block_sum' : op === '-' ? 'block_sub' : op === '*' ? 'block_mul' : 'block_div';
                animationData = {
                    left,
                    leftName: isNaN(Number(leftToken)) ? leftToken : undefined,
                    right,
                    rightName: isNaN(Number(rightToken)) ? rightToken : undefined,
                    op,
                    result: val,
                    destVar: name
                };
                
                currentVars[name] = { value: val, type };
            } else {
                const val = evaluateExpression(expr, varsSnapshot);
                animType = 'assign_flow';
                animationData = { value: val, destVar: name };
                currentVars[name] = { value: val, type };
            }

            // Mark variable as new
            const newVars = { ...varsSnapshot };
            newVars[name] = { value: currentVars[name].value, type, isNew: true };

            frame = {
                lineNumber: lineNum,
                lineText,
                type: 'declare',
                variables: newVars,
                description: `Se declara la variable "${name}" de tipo ${type} con valor inicial: ${currentVars[name].value}`,
                animationType: animType,
                animationData,
                activeVariable: name
            };
            pc++;
        }
        else if (reAssign.test(lineText)) {
            const m = lineText.match(reAssign)!;
            const name = m[1];
            const op = m[2];
            const expr = m[3];

            if (!currentVars[name]) {
                // Undeclared variable, skip or treat as var
                currentVars[name] = { value: 0, type: 'var' };
            }

            const oldVal = currentVars[name].value;
            const type = currentVars[name].type;
            let newVal = oldVal;
            let animType: StepFrame['animationType'] = 'assign_flow';
            let animationData: any = null;

            // Handle assignments like +=, -=
            let processedExpr = expr;
            if (op !== '=') {
                const rawOp = op.substring(0, 1);
                processedExpr = `${name} ${rawOp} ${expr}`;
            }

            const mathMatch = processedExpr.match(/^\s*(\w+|\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\w+|\d+(?:\.\d+)?)\s*$/);
            if (mathMatch) {
                const mathOp = mathMatch[2];
                const leftToken = mathMatch[1];
                const rightToken = mathMatch[3];
                const left = evaluateExpression(leftToken, varsSnapshot);
                const right = evaluateExpression(rightToken, varsSnapshot);
                newVal = evaluateExpression(processedExpr, varsSnapshot);
                
                animType = mathOp === '+' ? 'block_sum' : mathOp === '-' ? 'block_sub' : mathOp === '*' ? 'block_mul' : 'block_div';
                animationData = {
                    left,
                    leftName: isNaN(Number(leftToken)) ? leftToken : undefined,
                    right,
                    rightName: isNaN(Number(rightToken)) ? rightToken : undefined,
                    op: mathOp,
                    result: newVal,
                    destVar: name
                };
            } else {
                newVal = evaluateExpression(processedExpr, varsSnapshot);
                animationData = { value: newVal, destVar: name };
            }

            currentVars[name].value = newVal;
            
            const updatedVars = { ...varsSnapshot };
            updatedVars[name] = { value: newVal, type, isChanged: true };

            frame = {
                lineNumber: lineNum,
                lineText,
                type: 'assign',
                variables: updatedVars,
                description: `Se asigna el valor ${newVal} a la variable "${name}" (antes: ${oldVal})`,
                animationType: animType,
                animationData,
                activeVariable: name
            };
            pc++;
        }
        else if (reIf.test(lineText)) {
            const m = lineText.match(reIf)!;
            const cond = m[1];
            const condRes = Boolean(evaluateExpression(cond, varsSnapshot));

            frame = {
                lineNumber: lineNum,
                lineText,
                type: 'condition',
                variables: varsSnapshot,
                description: `Evaluando condicional "if (${cond})". Resultado: ${condRes}`,
                animationType: condRes ? 'branch_true' : 'branch_false',
                conditionResult: condRes
            };

            const closeBraceIdx = braceMap[pc];
            if (condRes) {
                // If true, proceed to inside block
                pc++;
            } else {
                // If false, jump past if block
                if (closeBraceIdx !== undefined) {
                    // Check if next line contains else
                    const nextLineIdx = closeBraceIdx + 1;
                    if (nextLineIdx < lines.length && reElse.test(lines[nextLineIdx])) {
                        pc = nextLineIdx + 1; // go inside else block
                    } else {
                        pc = closeBraceIdx + 1;
                    }
                } else {
                    pc++;
                }
            }
        }
        else if (reElse.test(lineText)) {
            // If we are executing else directly, it means we entered from a previous IF block
            // that finished. We must skip the else block.
            const closeBraceIdx = braceMap[pc];
            if (closeBraceIdx !== undefined) {
                pc = closeBraceIdx + 1;
            } else {
                pc++;
            }
        }
        else if (reWhile.test(lineText)) {
            const m = lineText.match(reWhile)!;
            const cond = m[1];
            const condRes = Boolean(evaluateExpression(cond, varsSnapshot));

            // Track loop iteration limit to prevent freezing
            loopCounter[lineNum] = (loopCounter[lineNum] || 0) + 1;
            if (loopCounter[lineNum] > 50) {
                frame = {
                    lineNumber: lineNum,
                    lineText,
                    type: 'loop',
                    variables: varsSnapshot,
                    description: `ADVERTENCIA: Bucle limitado a 50 iteraciones por seguridad.`,
                    animationType: 'none',
                    conditionResult: false
                };
                const closeBraceIdx = braceMap[pc];
                pc = (closeBraceIdx !== undefined) ? closeBraceIdx + 1 : pc + 1;
            } else {
                frame = {
                    lineNumber: lineNum,
                    lineText,
                    type: 'loop',
                    variables: varsSnapshot,
                    description: `Evaluando bucle "while (${cond})". Iteración ${loopCounter[lineNum]}. Resultado: ${condRes}`,
                    animationType: condRes ? 'loop_enter' : 'none',
                    conditionResult: condRes,
                    loopIteration: loopCounter[lineNum]
                };

                const closeBraceIdx = braceMap[pc];
                if (condRes) {
                    pc++;
                } else {
                    pc = (closeBraceIdx !== undefined) ? closeBraceIdx + 1 : pc + 1;
                }
            }
        }
        else if (reFor.test(lineText)) {
            const m = lineText.match(reFor)!;
            const loopVar = m[1];
            const iterableExpr = m[2];

            // Handle range start..end
            let rangeStart = 0;
            let rangeEnd = 0;
            const rangeMatch = iterableExpr.match(/^\s*(\w+|\d+)\s*\.\.\s*(\w+|\d+)\s*$/);
            if (rangeMatch) {
                rangeStart = parseInt(evaluateExpression(rangeMatch[1], varsSnapshot), 10);
                rangeEnd = parseInt(evaluateExpression(rangeMatch[2], varsSnapshot), 10);
            }

            // Loop tracking
            loopCounter[lineNum] = (loopCounter[lineNum] || 0) + 1;
            const currentVal = rangeStart + (loopCounter[lineNum] - 1);
            const condRes = currentVal <= rangeEnd && loopCounter[lineNum] <= 50;

            if (condRes) {
                currentVars[loopVar] = { value: currentVal, type: 'int' };
                const newVars = { ...varsSnapshot };
                newVars[loopVar] = { value: currentVal, type: 'int', isNew: !varsSnapshot[loopVar] };
                
                frame = {
                    lineNumber: lineNum,
                    lineText,
                    type: 'loop',
                    variables: newVars,
                    description: `Bucle "for". Asignando iterador "${loopVar}" = ${currentVal}`,
                    animationType: 'loop_enter',
                    conditionResult: true,
                    loopIteration: loopCounter[lineNum]
                };
                pc++;
            } else {
                frame = {
                    lineNumber: lineNum,
                    lineText,
                    type: 'loop',
                    variables: varsSnapshot,
                    description: `Finaliza bucle "for".`,
                    animationType: 'none',
                    conditionResult: false
                };
                const closeBraceIdx = braceMap[pc];
                pc = (closeBraceIdx !== undefined) ? closeBraceIdx + 1 : pc + 1;
            }
        }
        else if (rePrint.test(lineText)) {
            const m = lineText.match(rePrint)!;
            const expr = m[1];
            const val = evaluateExpression(expr, varsSnapshot);

            frame = {
                lineNumber: lineNum,
                lineText,
                type: 'print',
                variables: varsSnapshot,
                description: `Imprimir en consola: ${val}`,
                animationType: 'print_bubble',
                animationData: { value: val }
            };
            pc++;
        }
        else if (reInput.test(lineText)) {
            const m = lineText.match(reInput)!;
            const type = m[1];
            const name = m[2];
            const promptVal = m[3];
            
            // Simular un valor por defecto para input de manera visual
            const simulatedVal = type === 'int' ? 10 : type === 'double' ? 5.5 : type === 'bool' ? true : "hola";
            currentVars[name] = { value: simulatedVal, type };
            
            const newVars = { ...varsSnapshot };
            newVars[name] = { value: simulatedVal, type, isNew: true };

            frame = {
                lineNumber: lineNum,
                lineText,
                type: 'input',
                variables: newVars,
                description: `Petición de entrada con prompt ${promptVal}. Se simula la lectura de: ${simulatedVal}`,
                animationType: 'assign_flow',
                animationData: { value: simulatedVal },
                activeVariable: name
            };
            pc++;
        }
        else if (lineText === '}') {
            const openBraceIdx = braceMap[pc];
            if (openBraceIdx !== undefined) {
                const openLineText = lines[openBraceIdx].trim();
                // If it is loop closing brace, we must jump back to loop header to evaluate condition again
                if (reWhile.test(openLineText) || reFor.test(openLineText)) {
                    frame = {
                        lineNumber: lineNum,
                        lineText,
                        type: 'loop',
                        variables: varsSnapshot,
                        description: `Regresando a evaluar condición de bucle (línea ${openBraceIdx + 1})`,
                        animationType: 'loop_back'
                    };
                    pc = openBraceIdx;
                } else {
                    pc++;
                }
            } else {
                pc++;
            }
        } else {
            pc++;
        }

        if (frame) {
            steps.push(frame);
            totalSteps++;
        }
    }

    // Add program end frame if steps exist
    if (steps.length > 0) {
        steps.push({
            lineNumber: lines.length,
            lineText: "}",
            type: 'program_end',
            variables: currentVars,
            description: "Ejecución finalizada",
            animationType: 'none'
        });
    }

    return steps;
}

/* ════════════════════════════════
   DIAGRAMA DE FLUJO COMPACTO PARA STEPPER
   ════════════════════════════════ */

export interface StepperDiagramNode {
    id: number;
    type: 'start' | 'end' | 'declare' | 'assign' | 'condition' | 'loop' | 'print' | 'input';
    label: string;
    lineNumber: number;
}

export interface StepperDiagramLink {
    from: number;
    to: number;
    label?: string;
}

export interface StepperDiagram {
    nodes: StepperDiagramNode[];
    links: StepperDiagramLink[];
}

/**
 * Genera un diagrama de flujo compacto (lista lineal de nodos) a partir del código RE.
 * Optimizado para renderizarse de forma compacta y sin zoom en el panel central del stepper.
 */
export function generateStepperDiagram(code: string): StepperDiagram {
    const lines = code.split('\n');
    const nodes: StepperDiagramNode[] = [];
    const links: StepperDiagramLink[] = [];
    let nodeId = 0;

    const reProgram  = /^\s*program\s+(\w+)\s*\{/;
    const reIf       = /^\s*if\s*\((.+?)\)\s*\{/;
    const reWhile    = /^\s*while\s*\((.+?)\)\s*\{/;
    const reFor      = /^\s*for\s+(\w+)\s+in\s+(.+?)\s*\{/;
    const rePrint    = /^\s*print\s*\((.+)\)\s*;/;
    const reInput    = /^\s*(\w+)\s+(\w+)\s*=\s*input\s*\((.+?)\)\s*;/;
    const reDecl     = /^\s*(int|double|string|bool|var)\s+(\w+)\s*=\s*(.+?)\s*;/;
    const reAssign   = /^\s*(\w+)\s*(=|\+=|-=|\*=|\/=)\s*(.+?)\s*;/;
    const reElse     = /^\s*\}\s*else\s*\{/;

    const addNode = (type: StepperDiagramNode['type'], label: string, lineNumber: number): number => {
        const id = nodeId++;
        nodes.push({ id, type, label, lineNumber });
        return id;
    };

    const addLink = (from: number, to: number, label?: string) => {
        if (from >= 0 && to >= 0) links.push({ from, to, label });
    };

    let prevId = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('//') || line === '{' || line === '}') continue;
        if (reElse.test(line)) continue;

        let id = -1;

        if (reProgram.test(line)) {
            const m = line.match(reProgram)!;
            id = addNode('start', `program ${m[1]}`, i + 1);
        } else if (reIf.test(line)) {
            const m = line.match(reIf)!;
            id = addNode('condition', `if (${m[1]})`, i + 1);
        } else if (reWhile.test(line)) {
            const m = line.match(reWhile)!;
            id = addNode('loop', `while (${m[1]})`, i + 1);
        } else if (reFor.test(line)) {
            const m = line.match(reFor)!;
            id = addNode('loop', `for ${m[1]} in ${m[2]}`, i + 1);
        } else if (rePrint.test(line)) {
            const m = line.match(rePrint)!;
            id = addNode('print', `print(${m[1]})`, i + 1);
        } else if (reInput.test(line)) {
            const m = line.match(reInput)!;
            id = addNode('input', `input → ${m[2]}`, i + 1);
        } else if (reDecl.test(line)) {
            const m = line.match(reDecl)!;
            id = addNode('declare', `${m[1]} ${m[2]} = ${m[3]}`, i + 1);
        } else if (reAssign.test(line)) {
            const m = line.match(reAssign)!;
            id = addNode('assign', `${m[1]} ${m[2]} ${m[3]}`, i + 1);
        }

        if (id >= 0) {
            if (prevId >= 0) addLink(prevId, id);
            prevId = id;
        }
    }

    // Nodo de fin
    const endId = addNode('end', 'FIN', lines.length);
    if (prevId >= 0) addLink(prevId, endId);

    return { nodes, links };
}

/* ════════════════════════════════
   RENDER DE DIAGRAMA EN COLUMNA CENTRAL
   ════════════════════════════════ */

let stepperDiagram: StepperDiagram | null = null;

function renderStepperDiagram(diagram: StepperDiagram, activeLineNumber: number) {
    const canvas = document.getElementById('stepperAnimCanvas')!;
    canvas.innerHTML = '';

    const diagramEl = document.createElement('div');
    diagramEl.className = 'sdiagram-container';

    for (let i = 0; i < diagram.nodes.length; i++) {
        const node = diagram.nodes[i];
        const isActive = node.lineNumber === activeLineNumber;

        // Línea de conector antes del nodo
        if (i > 0) {
            const connector = document.createElement('div');
            connector.className = 'sdiagram-connector';
            diagramEl.appendChild(connector);
        }

        const nodeEl = document.createElement('div');
        nodeEl.className = `sdiagram-node sdiagram-node-${node.type}`;
        nodeEl.setAttribute('data-node-id', String(node.id));
        nodeEl.setAttribute('data-line', String(node.lineNumber));
        if (isActive) nodeEl.classList.add('sdiagram-node-active');

        const labelEl = document.createElement('div');
        labelEl.className = 'sdiagram-node-label';
        labelEl.textContent = node.label;
        nodeEl.appendChild(labelEl);

        diagramEl.appendChild(nodeEl);
    }

    canvas.appendChild(diagramEl);

    // Scroll al nodo activo
    const activeEl = canvas.querySelector('.sdiagram-node-active');
    if (activeEl) {
        activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
}

/* ════════════════════════════════
   ANIMACIÓN FÍSICA flyToMemory
   ════════════════════════════════ */

/**
 * Crea un bloque flotante que vuela desde el nodo activo hasta la celda
 * de la variable destino en la columna derecha de variables.
 */
function animateDataFlow(destVar: string, value: any) {
    // Buscar el nodo activo en el diagrama
    const activeNode = document.querySelector('.sdiagram-node-active') as HTMLElement | null;
    // Buscar la fila de la variable destino
    const varRow = document.querySelector(`[data-varname="${destVar}"]`) as HTMLElement | null;

    if (!activeNode || !varRow) return;

    const srcRect = activeNode.getBoundingClientRect();
    const dstRect = varRow.getBoundingClientRect();

    // Crear bloque flotante
    const block = document.createElement('div');
    block.className = 'floating-block';
    block.textContent = String(value);

    // Posición inicial: centro del nodo activo
    const startX = srcRect.left + srcRect.width / 2 - 20;
    const startY = srcRect.top + srcRect.height / 2 - 14;
    const endX = dstRect.left + 4;
    const endY = dstRect.top + dstRect.height / 2 - 14;

    block.style.setProperty('--startX', `${startX}px`);
    block.style.setProperty('--startY', `${startY}px`);
    block.style.setProperty('--endX', `${endX}px`);
    block.style.setProperty('--endY', `${endY}px`);
    block.style.left = `${startX}px`;
    block.style.top = `${startY}px`;

    document.body.appendChild(block);

    // Al terminar la animación: remover bloque y hacer flash en la celda
    block.addEventListener('animationend', () => {
        block.remove();
        varRow.classList.remove('changed-var');
        // Forzar reflow para reiniciar la animación
        void varRow.offsetWidth;
        varRow.classList.add('changed-var');
    });
}

// Stepper playback state
let currentSteps: StepFrame[] = [];
let currentStepIndex = 0;
let playbackInterval: any = null;
let currentSpeed = 1000;
let backEditor: any = null;

export function openStepper(steps: StepFrame[], editor: any) {
    currentSteps = steps;
    currentStepIndex = 0;
    backEditor = editor;

    // Generar diagrama de flujo compacto para la columna central
    const code = editor.getValue();
    stepperDiagram = generateStepperDiagram(code);

    const overlay = document.getElementById('stepperOverlay')!;
    overlay.style.display = 'flex';

    // Reset controls UI
    const btnPlay = document.getElementById('btnStepPlay')!;
    btnPlay.innerHTML = '▶ Play';
    if (playbackInterval) {
        clearInterval(playbackInterval);
        playbackInterval = null;
    }

    // Setup Event Listeners
    setupEvents();

    // Render first step
    goToStep(0);
}

export function closeStepper() {
    if (playbackInterval) {
        clearInterval(playbackInterval);
        playbackInterval = null;
    }
    const overlay = document.getElementById('stepperOverlay')!;
    overlay.style.display = 'none';

    if (backEditor) {
        backEditor.clearSelection();
    }
}

function setupEvents() {
    const btnClose = document.getElementById('btnCloseStepper')!;
    const btnFirst = document.getElementById('btnStepFirst')!;
    const btnPrev = document.getElementById('btnStepPrev')!;
    const btnPlay = document.getElementById('btnStepPlay')!;
    const btnNext = document.getElementById('btnStepNext')!;
    const btnLast = document.getElementById('btnStepLast')!;
    const speedSelect = document.getElementById('stepSpeed') as HTMLSelectElement;

    btnClose.onclick = closeStepper;

    btnFirst.onclick = () => {
        pausePlayback();
        goToStep(0);
    };

    btnPrev.onclick = () => {
        pausePlayback();
        if (currentStepIndex > 0) {
            goToStep(currentStepIndex - 1);
        }
    };

    btnNext.onclick = () => {
        pausePlayback();
        if (currentStepIndex < currentSteps.length - 1) {
            goToStep(currentStepIndex + 1);
        }
    };

    btnLast.onclick = () => {
        pausePlayback();
        goToStep(currentSteps.length - 1);
    };

    btnPlay.onclick = () => {
        if (playbackInterval) {
            pausePlayback();
        } else {
            startPlayback();
        }
    };

    speedSelect.onchange = () => {
        currentSpeed = parseInt(speedSelect.value, 10);
        if (playbackInterval) {
            // restart with new speed
            pausePlayback();
            startPlayback();
        }
    };
}

function startPlayback() {
    const btnPlay = document.getElementById('btnStepPlay')!;
    btnPlay.innerHTML = '⏸ Pause';
    
    playbackInterval = setInterval(() => {
        if (currentStepIndex < currentSteps.length - 1) {
            goToStep(currentStepIndex + 1);
        } else {
            pausePlayback();
        }
    }, currentSpeed);
}

function pausePlayback() {
    const btnPlay = document.getElementById('btnStepPlay')!;
    btnPlay.innerHTML = '▶ Play';
    if (playbackInterval) {
        clearInterval(playbackInterval);
        playbackInterval = null;
    }
}

function goToStep(index: number) {
    if (index < 0 || index >= currentSteps.length) return;
    currentStepIndex = index;
    const step = currentSteps[index];

    // Disable/enable playback controls
    const btnFirst = document.getElementById('btnStepFirst') as HTMLButtonElement;
    const btnPrev = document.getElementById('btnStepPrev') as HTMLButtonElement;
    const btnNext = document.getElementById('btnStepNext') as HTMLButtonElement;
    const btnLast = document.getElementById('btnStepLast') as HTMLButtonElement;

    btnFirst.disabled = index === 0;
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === currentSteps.length - 1;
    btnLast.disabled = index === currentSteps.length - 1;

    // 1. Progress Bar
    const progressBar = document.getElementById('stepperProgressBar')!;
    const percentage = (index / (currentSteps.length - 1)) * 100;
    progressBar.style.width = `${percentage}%`;

    // 2. Render Code View
    renderCodeView(step.lineNumber);

    // 3. Render Variables Table
    renderVariables(step.variables);

    // 4. Description Box
    const descBox = document.getElementById('stepperDescription')!;
    descBox.textContent = `[Paso ${index + 1} de ${currentSteps.length}] ${step.description}`;

    // 5. Render Diagram or Animation in Canvas
    if (stepperDiagram) {
        renderStepperDiagram(stepperDiagram, step.lineNumber);
        // Animar bloque físico hacia memoria si hay variable destino
        if (step.animationData?.destVar && step.animationData?.result !== undefined) {
            // Pequeño delay para que el DOM se actualice primero
            setTimeout(() => animateDataFlow(step.animationData!.destVar!, step.animationData!.result), 150);
        } else if (step.animationData?.destVar && step.animationData?.value !== undefined) {
            setTimeout(() => animateDataFlow(step.animationData!.destVar!, step.animationData!.value), 150);
        }
    } else {
        renderAnimation(step);
    }

    // 6. Highlight inside main Ace Editor (in background)
    if (backEditor) {
        backEditor.gotoLine(step.lineNumber, 0, true);
        backEditor.selection.selectLine();
    }
}

function renderCodeView(currentLine: number) {
    const codeView = document.getElementById('stepperCodeView')!;
    if (!backEditor) return;
    
    const lines = backEditor.getValue().split('\n');
    codeView.innerHTML = lines.map((line: string, i: number) => {
        const lineNum = i + 1;
        const isPast = lineNum < currentLine;
        const isCurrent = lineNum === currentLine;
        const cls = isCurrent ? 'step-line-current' : isPast ? 'step-line-past' : 'step-line-future';
        return `<div class="step-code-line ${cls}">
            <span class="step-line-num">${lineNum}</span>
            <span class="step-line-text">${escapeHtml(line)}</span>
        </div>`;
    }).join('');

    // Smooth scroll current line into view
    const currentLineEl = codeView.querySelector('.step-line-current');
    if (currentLineEl) {
        currentLineEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
}

function renderVariables(variables: StepFrame['variables']) {
    const varList = document.getElementById('stepperVarList')!;
    varList.innerHTML = '';

    for (const [name, info] of Object.entries(variables)) {
        const row = document.createElement('div');
        row.className = `var-row var-type-${info.type}`;
        if (info.isNew) row.classList.add('new-var');
        if (info.isChanged) row.classList.add('changed-var');
        row.setAttribute('data-varname', name);

        row.innerHTML = `
            <span class="var-type">${escapeHtml(info.type)}</span>
            <span class="var-name">${escapeHtml(name)}</span>
            <span class="var-equals">=</span>
            <span class="var-value">${escapeHtml(String(info.value))}</span>
        `;
        varList.appendChild(row);
    }
}

function renderAnimation(step: StepFrame) {
    const canvas = document.getElementById('stepperAnimCanvas')!;
    canvas.innerHTML = '';

    const animType = step.animationType;
    const data = step.animationData;

    if (animType.startsWith('block_')) {
        const op = data?.op ?? '';
        const leftVal = data?.left;
        const rightVal = data?.right;
        const resultVal = data?.result;

        const container = document.createElement('div');
        container.className = 'anim-equation';

        const typeCls = typeof leftVal === 'number' ? 'type-int' : 'type-string';

        container.innerHTML = `
            <div class="anim-block ${typeCls}">${escapeHtml(String(leftVal))}</div>
            <div class="anim-operator">${escapeHtml(op)}</div>
            <div class="anim-block ${typeCls}">${escapeHtml(String(rightVal))}</div>
            <div class="anim-dest-arrow">➔</div>
            <div class="anim-block ${typeCls}" style="animation: blockPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);">${escapeHtml(String(resultVal))}</div>
        `;
        canvas.appendChild(container);
    } 
    else if (animType === 'assign_flow') {
        const val = data?.value !== undefined ? data.value : '';
        const container = document.createElement('div');
        container.className = 'anim-equation';

        const typeCls = typeof val === 'number' ? 'type-int' : typeof val === 'boolean' ? 'type-bool' : 'type-string';

        container.innerHTML = `
            <div class="anim-block ${typeCls}">${escapeHtml(String(val))}</div>
            <div class="anim-dest-arrow">➔</div>
            <div class="anim-block" style="border-style: dashed; color: #8e90a2;">${escapeHtml(step.activeVariable || 'variable')}</div>
        `;
        canvas.appendChild(container);
    }
    else if (animType === 'branch_true' || animType === 'branch_false') {
        const isTrue = animType === 'branch_true';
        const condText = step.lineText.replace(/if\s*\(|\)\s*\{/g, '').trim();

        // Calculate dynamic diamond size to adapt to text size
        const charCount = condText.length;
        const size = Math.max(100, Math.min(220, charCount * 6 + 60));

        const container = document.createElement('div');
        container.className = 'stepper-branch';

        container.innerHTML = `
            <div class="branch-diamond-wrap">
                <div class="branch-diamond" style="width: ${size}px; height: ${size}px;">
                    <div class="branch-diamond-text" style="max-width: ${Math.floor(size * 0.75)}px;">${escapeHtml(condText)}</div>
                </div>
            </div>
            <div class="branch-paths">
                <div class="branch-path true-path ${isTrue ? 'active' : ''}">TRUE (Entrar)</div>
                <div class="branch-path false-path ${!isTrue ? 'active' : ''}">FALSE (Saltar)</div>
            </div>
        `;
        canvas.appendChild(container);
    }
    else if (animType === 'loop_enter' || animType === 'loop_back') {
        const container = document.createElement('div');
        container.className = 'stepper-loop-view';

        const text = animType === 'loop_enter' 
            ? `Entrando al bucle (Iteración ${step.loopIteration || 1})`
            : `Regresando a evaluar condición`;

        container.innerHTML = `
            <div class="loop-icon-circle">↻</div>
            <div class="loop-info">${escapeHtml(text)}</div>
        `;
        canvas.appendChild(container);
    }
    else if (animType === 'print_bubble') {
        const val = data?.value !== undefined ? data.value : '';
        const container = document.createElement('div');
        container.className = 'print-bubble-wrap';

        container.innerHTML = `
            <div class="print-bubble">${escapeHtml(String(val))}</div>
        `;
        canvas.appendChild(container);
    }
    else {
        // Default visual or simple instruction box
        const defaultBox = document.createElement('div');
        defaultBox.style.color = '#8e90a2';
        defaultBox.style.fontFamily = 'Space Mono, monospace';
        defaultBox.style.fontSize = '14px';
        defaultBox.style.textAlign = 'center';
        defaultBox.textContent = `Línea: ${step.lineText}`;
        canvas.appendChild(defaultBox);
    }
}
