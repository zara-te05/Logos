import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor.js';
import { Re_ParserVisitor } from '../Re_ParserVisitor.js';
import {
    ProgramContext,
    Print_statementContext,
    ExpressionContext,
    Var_declContext,
    Var_assignContext,
    If_statementContext,
    While_statementContext,
    Do_while_statementContext,
    For_statementContext,
    For_expressionContext,
    Function_declContext,
    Function_callContext,
    Method_callContext,
    Return_statementContext,
    LiteralContext,
} from '../Re_Parser.js';
import { Re_Parser } from '../Re_Parser.js';
import { Enviroment } from './Environment.js';
import * as fs from 'fs';

// ============================================================
// Clase especial para señalizar un return desde una funcion
// ============================================================
class ReturnSignal {
    constructor(public value: any) {}
}

// ============================================================
// Tipo que describe una funcion guardada en memoria
// ============================================================
interface FunctionRecord {
    ctx: Function_declContext;
    closureEnv: Enviroment;
}

// ============================================================
// Clase que envuelve un array para darle métodos de lista
// ============================================================
class ReList {
    public items: any[];
    public elementType: string;

    constructor(elementType: string = 'any', items: any[] = []) {
        this.elementType = elementType;
        this.items = [...items];
    }

    add(value: any): void {
        this.items.push(value);
    }

    remove(index: number): void {
        if (index < 0 || index >= this.items.length) {
            throw new Error(`[Error] Índice ${index} fuera de rango en .remove().`);
        }
        this.items.splice(index, 1);
    }

    size(): number {
        return this.items.length;
    }

    get(index: number): any {
        if (index < 0 || index >= this.items.length) {
            throw new Error(`[Error] Índice ${index} fuera de rango.`);
        }
        return this.items[index];
    }

    toString(): string {
        return `[${this.items.join(', ')}]`;
    }
}

// ============================================================
// Clase que envuelve un array de tamano fijo (array<T>)
// ============================================================
class ReArray {
    public items: any[];
    public elementType: string;

    constructor(elementType: string, items: any[]) {
        this.elementType = elementType;
        this.items = [...items];
    }

    size(): number {
        return this.items.length;
    }

    get(index: number): any {
        if (index < 0 || index >= this.items.length) {
            throw new Error(`[Error] Índice ${index} fuera de rango.`);
        }
        return this.items[index];
    }

    toString(): string {
        return `[${this.items.join(', ')}]`;
    }
}

// ============================================================
// Clase que envuelve un array para representar una cola (queue<T>)
// ============================================================
class ReQueue {
    public items: any[];
    public elementType: string;

    constructor(elementType: string = 'any', items: any[] = []) {
        this.elementType = elementType;
        this.items = [...items];
    }

    enqueue(value: any): void {
        this.items.push(value);
    }

    dequeue(): any {
        if (this.items.length === 0) {
            throw new Error(`[Error] Cola vacía.`);
        }
        return this.items.shift();
    }

    size(): number {
        return this.items.length;
    }

    toString(): string {
        return `queue<${this.elementType}>[${this.items.join(', ')}]`;
    }
}

// ============================================================
// Clase que envuelve un array para representar una pila (stack<T>)
// ============================================================
class ReStack {
    public items: any[];
    public elementType: string;

    constructor(elementType: string = 'any', items: any[] = []) {
        this.elementType = elementType;
        this.items = [...items];
    }

    push(value: any): void {
        this.items.push(value);
    }

    pop(): any {
        if (this.items.length === 0) {
            throw new Error(`[Error] Pila vacía.`);
        }
        return this.items.pop();
    }

    size(): number {
        return this.items.length;
    }

    toString(): string {
        return `stack<${this.elementType}>[${this.items.join(', ')}]`;
    }
}


// ============================================================
// INTERPRETE PRINCIPAL
// ============================================================
export class Interpreter extends AbstractParseTreeVisitor<any> implements Re_ParserVisitor<any> {

    // Entorno global del programa
    private globalEnv: Enviroment = new Enviroment();

    // Mapa de funciones declaradas: nombre -> su nodo del arbol
    private functions: Map<string, FunctionRecord> = new Map();

    // -------------------------
    // Resultado por defecto
    // -------------------------
    protected defaultResult() {
        return null;
    }

    // ================================================================
    // PROGRAMA PRINCIPAL
    // ================================================================
    visitProgram(ctx: ProgramContext) {
        // Primer pasada: registrar TODAS las funciones (para que puedan usarse antes de ser declaradas)
        for (const fnCtx of ctx.function_decl()) {
            this.visitFunction_decl(fnCtx);
        }
        // Segunda pasada: ejecutar todas las sentencias en orden
        for (const sentenceCtx of ctx.sentence()) {
            const result = this.visit(sentenceCtx);
            if (result instanceof ReturnSignal) break;
        }
        return null;
    }

    // ================================================================
    // DECLARACION DE FUNCIONES: las guarda en el mapa de funciones
    // ================================================================
    visitFunction_decl(ctx: Function_declContext) {
        const name = ctx.ID().text;
        this.functions.set(name, { ctx, closureEnv: this.globalEnv });
        return null;
    }

    // ================================================================
    // LLAMADA A FUNCIONES
    // ================================================================
    visitFunction_call(ctx: Function_callContext): any {
        const name = ctx.ID().text;

        // --- Funciones incorporadas del lenguaje ---
        if (name === 'len' || name === 'size') {
            const args = ctx.argument_list()?.expression() ?? [];
            if (args.length !== 1) {
                throw new Error(`[Error] Línea ${ctx.start?.line}: '${name}' espera 1 argumento.`);
            }
            const val = this.visitExpression(args[0]!);
            if (val instanceof ReList || val instanceof ReArray) return val.size();
            if (Array.isArray(val)) return val.length;
            if (typeof val === 'string') return val.length;
            throw new Error(`[Error] '${name}' no es aplicable a ${typeof val}.`);
        }

        if (name === 'to_str') {
            const args = ctx.argument_list()?.expression() ?? [];
            if (args.length !== 1) throw new Error(`[Error] 'to_str' espera 1 argumento.`);
            const val = this.visitExpression(args[0]!);
            return String(val);
        }

        if (name === 'to_int') {
            const args = ctx.argument_list()?.expression() ?? [];
            if (args.length !== 1) throw new Error(`[Error] 'to_int' espera 1 argumento.`);
            const val = this.visitExpression(args[0]!);
            const parsed = parseInt(String(val), 10);
            if (isNaN(parsed)) throw new Error(`[Error] No se puede convertir '${val}' a int.`);
            return parsed;
        }

        if (name === 'to_double') {
            const args = ctx.argument_list()?.expression() ?? [];
            if (args.length !== 1) throw new Error(`[Error] 'to_double' espera 1 argumento.`);
            const val = this.visitExpression(args[0]!);
            const parsed = parseFloat(String(val));
            if (isNaN(parsed)) throw new Error(`[Error] No se puede convertir '${val}' a double.`);
            return parsed;
        }

        // --- Funcion definida por el usuario ---
        const fn = this.functions.get(name);
        if (!fn) {
            const line = ctx.start?.line ?? '?';
            const col  = ctx.start?.charPositionInLine ?? '?';
            throw new Error(`[Error] Línea ${line}:${col} - La función '${name}' no está definida.`);
        }

        // Evaluar argumentos
        const args: any[] = [];
        if (ctx.argument_list()) {
            for (const exprCtx of ctx.argument_list()!.expression()) {
                args.push(this.visitExpression(exprCtx));
            }
        }

        // Verificar numero de argumentos
        const paramList = fn.ctx.param_list();
        const paramCount = paramList ? paramList.ID().length : 0;
        if (args.length !== paramCount) {
            const line = ctx.start?.line ?? '?';
            throw new Error(
                `[Error] Línea ${line}: La función '${name}' espera ${paramCount} argumento(s) pero recibió ${args.length}.`
            );
        }

        // Crear entorno nuevo (scope de la funcion) con el entorno global como padre
        const fnEnv = new Enviroment(fn.closureEnv);

        // Vincular parametros a sus valores
        if (paramList) {
            const paramIds = paramList.ID();
            for (let i = 0; i < paramIds.length; i++) {
                const paramName = paramIds[i]?.text ?? '';
                fnEnv.define(paramName, args[i] ?? null);
            }
        }

        // Guardar entorno actual y cambiar al de la funcion
        const previousEnv = this.globalEnv;
        this.globalEnv = fnEnv;

        let returnValue: any = null;
        try {
            for (const sentence of fn.ctx.sentence()) {
                const result = this.visit(sentence);
                if (result instanceof ReturnSignal) {
                    returnValue = result.value;
                    break;
                }
            }
        } finally {
            // Restaurar entorno previo
            this.globalEnv = previousEnv;
        }

        return returnValue;
    }

    // ================================================================
    // LLAMADA A MÉTODOS: obj.método(args)
    // ================================================================
    visitMethod_call(ctx: Method_callContext): any {
        const objName  = ctx.ID(0).text;
        const method   = ctx.ID(1).text;
        const obj      = this.globalEnv.lookup(objName);

        // Evaluar argumentos
        const args: any[] = [];
        if (ctx.argument_list()) {
            for (const exprCtx of ctx.argument_list()!.expression()) {
                args.push(this.visitExpression(exprCtx));
            }
        }

        // Métodos para list<T>
        if (obj instanceof ReList) {
            switch (method) {
                case 'add':
                    if (args.length !== 1) throw new Error(`[Error] .add() espera 1 argumento.`);
                    obj.add(args[0]);
                    return null;
                case 'remove':
                    if (args.length !== 1) throw new Error(`[Error] .remove() espera 1 argumento (índice).`);
                    obj.remove(args[0]);
                    return null;
                case 'size':
                    return obj.size();
                case 'get':
                    if (args.length !== 1) throw new Error(`[Error] .get() espera 1 argumento (índice).`);
                    return obj.get(args[0]);
                default:
                    throw new Error(`[Error] list<T> no tiene el método '${method}'.`);
            }
        }

        // Métodos para array<T>
        if (obj instanceof ReArray) {
            switch (method) {
                case 'size':
                    return obj.size();
                case 'get':
                    if (args.length !== 1) throw new Error(`[Error] .get() espera 1 argumento (índice).`);
                    return obj.get(args[0]);
                default:
                    throw new Error(`[Error] array<T> no tiene el método '${method}'. Los arrays son de tamaño fijo.`);
            }
        }

        // Métodos para queue<T>
        if (obj instanceof ReQueue) {
            switch (method) {
                case 'enqueue':
                    if (args.length !== 1) throw new Error(`[Error] .enqueue() espera 1 argumento.`);
                    obj.enqueue(args[0]);
                    return null;
                case 'dequeue':
                    if (args.length !== 0) throw new Error(`[Error] .dequeue() no espera argumentos.`);
                    return obj.dequeue();
                case 'size':
                    if (args.length !== 0) throw new Error(`[Error] .size() no espera argumentos.`);
                    return obj.size();
                default:
                    throw new Error(`[Error] queue<T> no tiene el método '${method}'.`);
            }
        }

        // Métodos para stack<T>
        if (obj instanceof ReStack) {
            switch (method) {
                case 'push':
                    if (args.length !== 1) throw new Error(`[Error] .push() espera 1 argumento.`);
                    obj.push(args[0]);
                    return null;
                case 'pop':
                    if (args.length !== 0) throw new Error(`[Error] .pop() no espera argumentos.`);
                    return obj.pop();
                case 'size':
                    if (args.length !== 0) throw new Error(`[Error] .size() no espera argumentos.`);
                    return obj.size();
                default:
                    throw new Error(`[Error] stack<T> no tiene el método '${method}'.`);
            }
        }

        // Métodos para string
        if (typeof obj === 'string') {
            switch (method) {
                case 'size':
                case 'length':
                    return obj.length;
                case 'upper':
                case 'toUpperCase':
                    return obj.toUpperCase();
                case 'lower':
                case 'toLowerCase':
                    return obj.toLowerCase();
                case 'contains':
                    if (args.length !== 1) throw new Error(`[Error] .contains() espera 1 argumento.`);
                    return obj.includes(String(args[0]));
                case 'substring':
                    if (args.length < 1) throw new Error(`[Error] .substring() espera al menos 1 argumento.`);
                    return args.length === 2 ? obj.substring(args[0], args[1]) : obj.substring(args[0]);
                default:
                    throw new Error(`[Error] string no tiene el método '${method}'.`);
            }
        }

        const line = ctx.start?.line ?? '?';
        throw new Error(`[Error] Línea ${line}: '${objName}' no tiene el método '${method}'.`);
    }

    // ================================================================
    // RETURN
    // ================================================================
    visitReturn_statement(ctx: Return_statementContext): any {
        if (ctx.expression()) {
            const value = this.visitExpression(ctx.expression()!);
            return new ReturnSignal(value);
        }
        return new ReturnSignal(null);
    }

    // ================================================================
    // PRINT
    // ================================================================
    visitPrint_statement(ctx: Print_statementContext) {
        if (ctx.expression()) {
            const value = this.visitExpression(ctx.expression()!);
            // Representacion legible para colecciones
            if (value instanceof ReList || value instanceof ReArray || value instanceof ReQueue || value instanceof ReStack) {
                console.log(value.toString());
            } else {
                console.log(value);
            }
        } else {
            console.log('');
        }
        return null;
    }

    // ================================================================
    // INPUT: var x = input("Prompt");
    // (Nota: en modo script lee de stdin de forma síncrona con una
    // implementacion simplificada; para produccion usar async/await)
    // ================================================================


    // ================================================================
    // DECLARACION DE VARIABLES: int x = 5;  o  var y = "hola";
    //                           list<int> nums = [1, 2, 3];
    //                           array<int> arr = [4, 5, 6];
    // ================================================================
    visitVar_decl(ctx: Var_declContext) {
        const name = ctx.ID().text;
        let value: any = null;

        // Detectar el tipo declarado
        const typeSpec = ctx.type_specifier();
        let declaredType = '';
        if (typeSpec) {
            declaredType = typeSpec.text;  // e.g., "list<int>", "array<double>", "int"
        }

        if (ctx.expression()) {
            value = this.visitExpression(ctx.expression()!);
        }

        // Manejar colecciones
        if (declaredType.startsWith('list<')) {
            const elementType = declaredType.slice(5, -1);  // list<int> -> int
            if (Array.isArray(value)) {
                value = new ReList(elementType, value);
            } else if (value === null) {
                value = new ReList(elementType, []);
            } else if (!(value instanceof ReList)) {
                throw new Error(`[TypeError] '${name}': se esperaba una lista.`);
            }
        } else if (declaredType.startsWith('array<')) {
            const elementType = declaredType.slice(6, -1);  // array<int> -> int
            if (Array.isArray(value)) {
                value = new ReArray(elementType, value);
            } else if (value === null) {
                value = new ReArray(elementType, []);
            } else if (!(value instanceof ReArray)) {
                throw new Error(`[TypeError] '${name}': se esperaba un array.`);
            }
        } else if (declaredType.startsWith('queue<')) {
            const elementType = declaredType.slice(6, -1);
            if (Array.isArray(value)) {
                value = new ReQueue(elementType, value);
            } else if (value === null) {
                value = new ReQueue(elementType, []);
            } else if (!(value instanceof ReQueue)) {
                throw new Error(`[TypeError] '${name}': se esperaba una cola.`);
            }
        } else if (declaredType.startsWith('stack<')) {
            const elementType = declaredType.slice(6, -1);
            if (Array.isArray(value)) {
                value = new ReStack(elementType, value);
            } else if (value === null) {
                value = new ReStack(elementType, []);
            } else if (!(value instanceof ReStack)) {
                throw new Error(`[TypeError] '${name}': se esperaba una pila.`);
            }
        } else if (typeSpec && ctx.expression()) {
            // Verificacion de tipo fuerte para tipos primitivos
            value = this.enforceType(declaredType, value, name);
        }

        this.globalEnv.define(name, value);
        return null;
    }

    // ================================================================
    // REASIGNACION DE VARIABLES: x = 10;  x += 5;  x -= 2;  etc.
    // ================================================================
    visitVar_assign(ctx: Var_assignContext) {
        const name  = ctx.ID().text;
        const right = this.visitExpression(ctx.expression());

        // Determinar el operador usado
        let op = '=';
        if (ctx.PLUS_ASSIGN())  op = '+=';
        if (ctx.MINUS_ASSIGN()) op = '-=';
        if (ctx.MULT_ASSIGN())  op = '*=';
        if (ctx.DIV_ASSIGN())   op = '/=';

        if (op === '=') {
            this.globalEnv.assign(name, right);
        } else {
            const current = this.globalEnv.lookup(name);
            const line    = ctx.start?.line ?? '?';
            let newValue: any;

            switch (op) {
                case '+=':
                    if (typeof current === 'string' || typeof right === 'string') {
                        newValue = String(current) + String(right);
                    } else {
                        newValue = current + right;
                    }
                    break;
                case '-=':
                    if (typeof current !== 'number' || typeof right !== 'number') {
                        throw new Error(`[TypeError] Línea ${line}: '-=' requiere valores numéricos.`);
                    }
                    newValue = current - right;
                    break;
                case '*=':
                    if (typeof current !== 'number' || typeof right !== 'number') {
                        throw new Error(`[TypeError] Línea ${line}: '*=' requiere valores numéricos.`);
                    }
                    newValue = current * right;
                    break;
                case '/=':
                    if (typeof current !== 'number' || typeof right !== 'number') {
                        throw new Error(`[TypeError] Línea ${line}: '/=' requiere valores numéricos.`);
                    }
                    if (right === 0) throw new Error(`[Error] Línea ${line}: División entre cero.`);
                    newValue = current / right;
                    break;
                default:
                    newValue = right;
            }
            this.globalEnv.assign(name, newValue);
        }
        return null;
    }

    // ================================================================
    // IF / ELSE IF / ELSE
    // ================================================================
    visitIf_statement(ctx: If_statementContext): any {
        const expressions   = ctx.expression();
        const allSentences  = ctx.sentence();
        const blockSentences = this.splitSentencesIntoBlocks(ctx, allSentences);

        let conditionMet = false;
        for (let i = 0; i < expressions.length; i++) {
            const cond = this.visitExpression(expressions[i]!);
            if (this.isTruthy(cond)) {
                const block = blockSentences[i] ?? [];
                for (const s of block) {
                    const result = this.visit(s);
                    if (result instanceof ReturnSignal) return result;
                }
                conditionMet = true;
                break;
            }
        }

        if (!conditionMet && blockSentences.length > expressions.length) {
            const elseBlock = blockSentences[blockSentences.length - 1] ?? [];
            for (const s of elseBlock) {
                const result = this.visit(s);
                if (result instanceof ReturnSignal) return result;
            }
        }

        return null;
    }

    // ================================================================
    // WHILE
    // ================================================================
    visitWhile_statement(ctx: While_statementContext): any {
        while (true) {
            const cond = this.visitExpression(ctx.expression());
            if (!this.isTruthy(cond)) break;

            for (const s of ctx.sentence()) {
                const result = this.visit(s);
                if (result instanceof ReturnSignal) return result;
            }
        }
        return null;
    }

    // ================================================================
    // DO-WHILE
    // ================================================================
    visitDo_while_statement(ctx: Do_while_statementContext): any {
        do {
            for (const s of ctx.sentence()) {
                const result = this.visit(s);
                if (result instanceof ReturnSignal) return result;
            }
        } while (this.isTruthy(this.visitExpression(ctx.expression())));
        return null;
    }

    // ================================================================
    // FOR x IN rango/lista/variable
    // ================================================================
    visitFor_statement(ctx: For_statementContext): any {
        const varName  = ctx.ID().text;
        const iterable = this.visitFor_expression(ctx.for_expression());

        for (const item of iterable) {
            const forEnv = new Enviroment(this.globalEnv);
            forEnv.define(varName, item);
            const prevEnv = this.globalEnv;
            this.globalEnv = forEnv;

            try {
                for (const s of ctx.sentence()) {
                    const result = this.visit(s);
                    if (result instanceof ReturnSignal) {
                        this.globalEnv = prevEnv;
                        return result;
                    }
                }
            } finally {
                this.globalEnv = prevEnv;
            }
        }
        return null;
    }

    // ================================================================
    // FOR_EXPRESSION: genera el iterable (rango, lista literal, o variable)
    // ================================================================
    visitFor_expression(ctx: For_expressionContext): any[] {
        // Caso 1: rango con .. (ej: 1..10)
        if (ctx.DOTDOT()) {
            const exprs = ctx.expression();
            const start = this.visitExpression(exprs[0]!);
            const end   = this.visitExpression(exprs[1]!);
            const result: number[] = [];
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        }

        // Caso 2: lista literal (ej: [1, 2, 3])
        if (ctx.list_elements()) {
            return ctx.list_elements()!.expression().map(e => this.visitExpression(e));
        }

        // Caso 3: variable que ya es un array o lista
        if (ctx.ID()) {
            const val = this.globalEnv.lookup(ctx.ID()!.text);
            if (val instanceof ReList)  return val.items;
            if (val instanceof ReArray) return val.items;
            if (Array.isArray(val))     return val;
            throw new Error(`[Error] '${ctx.ID()!.text}' no es iterable.`);
        }

        return [];
    }

    // ================================================================
    // EXPRESIONES (el corazon del interprete)
    // ================================================================
    visitExpression(ctx: ExpressionContext): any {

        // --- Literal: numero, texto, bool, double ---
        if (ctx.literal()) {
            return this.visitLiteral(ctx.literal()!);
        }

        // --- Variable: solo un ID ---
        if (ctx.childCount === 1 && ctx.ID()) {
            return this.globalEnv.lookup(ctx.ID()!.text);
        }

        // --- Llamada a funcion ---
        if (ctx.function_call()) {
            return this.visitFunction_call(ctx.function_call()!);
        }

        // --- Llamada a método: obj.metodo(args) ---
        if (ctx.method_call()) {
            return this.visitMethod_call(ctx.method_call()!);
        }

        // --- Array/List literal: [1, 2, 3] ---
        if (ctx.LBRACKET() && ctx.childCount >= 2 && !ctx.ID()) {
            if (ctx.list_elements()) {
                return ctx.list_elements()!.expression().map(e => this.visitExpression(e));
            }
            return [];  // [] vacío
        }

        // --- Acceso a arreglo: ID[expr] ---
        if (ctx.ID() && ctx.LBRACKET()) {
            const objName = ctx.ID()!.text;
            const obj     = this.globalEnv.lookup(objName);
            const index   = this.visitExpression(ctx.expression(0)!);
            const line    = ctx.start?.line ?? '?';

            if (obj instanceof ReList)  return obj.get(index);
            if (obj instanceof ReArray) return obj.get(index);
            if (Array.isArray(obj)) {
                if (index < 0 || index >= obj.length) {
                    throw new Error(`[Error] Línea ${line}: Índice ${index} fuera de rango.`);
                }
                return obj[index] ?? null;
            }
            throw new Error(`[Error] Línea ${line}: '${objName}' no es un arreglo o lista.`);
        }

        // --- Expresion entre parentesis: (expr) ---
        if (ctx.LPAREN() && ctx.childCount === 3 && !ctx.ID()) {
            return this.visitExpression(ctx.expression(0)!);
        }

        // --- Negacion unaria: not expr  o  !expr ---
        if ((ctx.NOT_KW() || ctx.NOT_OP()) && ctx.childCount === 2) {
            const val = this.visitExpression(ctx.expression(0)!);
            return !this.isTruthy(val);
        }

        // --- Menos unario: -expr ---
        if (ctx.MINUS() && ctx.childCount === 2) {
            return -(this.visitExpression(ctx.expression(0)!));
        }

        // --- Input expression: input("prompt") ---
        if ((ctx as any).INPUT && (ctx as any).INPUT()) {
            // Obtener el prompt si se proveyó
            let prompt = '';
            if (ctx.STRING()) {
                const raw = ctx.STRING()!.text;
                prompt = raw.substring(1, raw.length - 1);
            }

            // Mostrar el prompt al usuario sin salto de línea
            if (prompt) fs.writeSync(1, prompt);

            // Leer de stdin de forma síncrona byte a byte hasta \n
            const chunks: Buffer[] = [];
            const buf = Buffer.alloc(1);
            while (true) {
                let n = 0;
                let gotData = false;
                while (true) {
                    try {
                        n = fs.readSync(0, buf, 0, 1, null);
                        gotData = true;
                        break;
                    } catch (err: any) {
                        if (err.code === 'EAGAIN' || err.code === 'EWOULDBLOCK') {
                            // Esperar 50ms antes de reintentar para no saturar la CPU
                            const sab = new SharedArrayBuffer(4);
                            const int32 = new Int32Array(sab);
                            Atomics.wait(int32, 0, 0, 50);
                            continue;
                        }
                        console.error("[readSync error]", err);
                        break;
                    }
                }
                if (!gotData || n === 0) break;           // EOF o error
                if (buf[0] === 0x0a) break;   // '\n'
                if (buf[0] !== 0x0d) {        // ignorar '\r' (Windows)
                    chunks.push(Buffer.from([buf[0]!]));
                }
            }

            return Buffer.concat(chunks).toString('utf8');
        }

        // --- Operacion binaria: expr OP expr ---
        if (ctx.childCount === 3) {
            const left  = this.visitExpression(ctx.expression(0)!);
            const right = this.visitExpression(ctx.expression(1)!);
            const op    = ctx.getChild(1).text;
            const line  = ctx.start?.line ?? '?';

            switch (op) {
                // Aritmeticos
                case '+':
                    if (typeof left === 'string' || typeof right === 'string') {
                        // Representacion especial para colecciones en concatenacion
                        const l = (left instanceof ReList || left instanceof ReArray) ? left.toString() : String(left);
                        const r = (right instanceof ReList || right instanceof ReArray) ? right.toString() : String(right);
                        return l + r;
                    }
                    return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/':
                    if (right === 0) throw new Error(`[Error] Línea ${line}: División entre cero.`);
                    return left / right;
                case '^': return Math.pow(left, right);

                // Comparacion
                case '==': return left === right;
                case '!=': return left !== right;
                case '>':  return left > right;
                case '<':  return left < right;
                case '>=': return left >= right;
                case '<=': return left <= right;

                // Logicos
                case 'and':
                case '&&': return this.isTruthy(left) && this.isTruthy(right);
                case 'or':
                case '||': return this.isTruthy(left) || this.isTruthy(right);

                default:
                    throw new Error(`[Error] Línea ${line}: Operador desconocido: '${op}'`);
            }
        }

        const line = ctx.start?.line ?? '?';
        const col  = ctx.start?.charPositionInLine ?? '?';
        throw new Error(`[Error] Línea ${line}:${col} - Expresión no reconocida: '${ctx.text}'`);
    }

    // ================================================================
    // LITERAL: int, double, string, bool
    // ================================================================
    visitLiteral(ctx: LiteralContext): any {
        if (ctx.INT())    return parseInt(ctx.INT()!.text, 10);
        if (ctx.DOUBLE()) return parseFloat(ctx.DOUBLE()!.text);
        if (ctx.STRING()) {
            const raw = ctx.STRING()!.text;
            return raw.substring(1, raw.length - 1);
        }
        if (ctx.BOOL()) return ctx.BOOL()!.text === 'true';
        return null;
    }

    // ================================================================
    // HELPERS PRIVADOS
    // ================================================================

    /** Determina si un valor es "verdadero" al estilo del lenguaje */
    private isTruthy(value: any): boolean {
        if (value === null || value === undefined) return false;
        if (typeof value === 'boolean') return value;
        if (typeof value === 'number')  return value !== 0;
        if (typeof value === 'string')  return value.length > 0;
        if (value instanceof ReList || value instanceof ReArray) return value.size() > 0;
        return true;
    }

    /**
     * Enforza el tipo declarado al asignar un valor.
     * Convierte donde sea posible, lanza error donde no.
     */
    private enforceType(declaredType: string, value: any, varName: string): any {
        const base = declaredType.split('<')[0];
        switch (base) {
            case 'int':    return this.assertInt(value, varName);
            case 'short':  return this.assertInt(value, varName);
            case 'long':   return this.assertInt(value, varName);
            case 'double': return this.assertNumber(value, varName);
            case 'string':
                if (typeof value !== 'string') {
                    throw new Error(`[TypeError] Variable '${varName}': se esperaba string, se recibió ${typeof value}.`);
                }
                return value;
            case 'bool':
                if (typeof value !== 'boolean') {
                    throw new Error(`[TypeError] Variable '${varName}': se esperaba bool, se recibió ${typeof value}.`);
                }
                return value;
            case 'var':    return value; // tipado dinamico
            default:       return value;
        }
    }

    private assertInt(value: any, name: string): number {
        if (typeof value !== 'number') {
            throw new Error(`[TypeError] Variable '${name}': se esperaba int, se recibió ${typeof value}.`);
        }
        return Math.trunc(value);
    }

    private assertNumber(value: any, name: string): number {
        if (typeof value !== 'number') {
            throw new Error(`[TypeError] Variable '${name}': se esperaba double, se recibió ${typeof value}.`);
        }
        return value;
    }

    /**
     * El if_statement en ANTLR nos da un array plano de todas las sentencias.
     * Este metodo las agrupa en bloques (uno por cada { }).
     */
    private splitSentencesIntoBlocks(ctx: If_statementContext, allSentences: any[]): any[][] {
        const blocks: any[][] = [];
        let current: any[]   = [];
        let sentenceIdx      = 0;

        for (let i = 0; i < ctx.childCount; i++) {
            const child = ctx.getChild(i);
            const text  = child.text;

            if (text === '{') {
                current = [];
            } else if (text === '}') {
                blocks.push(current);
                current = [];
            } else if (sentenceIdx < allSentences.length && child === allSentences[sentenceIdx]) {
                current.push(allSentences[sentenceIdx]);
                sentenceIdx++;
            }
        }

        return blocks;
    }
}