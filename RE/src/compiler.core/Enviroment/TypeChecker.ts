import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor.js';
import { Re_ParserVisitor } from '../Re_ParserVisitor.js';
import {
    ProgramContext,
    Function_declContext,
    SentenceContext,
    Var_declContext,
    Var_assignContext,
    Return_statementContext,
    If_statementContext,
    While_statementContext,
    Do_while_statementContext,
    For_statementContext,
    For_expressionContext,
    Function_callContext,
    Method_callContext,
    ExpressionContext,
    Print_statementContext,
    Input_statementContext,
    LiteralContext,
} from '../Re_Parser.js';

// ============================================================
// Tipos del sistema de tipos del lenguaje "Re"
// ============================================================
type ReType =
    | 'int'
    | 'double'
    | 'string'
    | 'bool'
    | 'void'
    | 'var'       // tipado dinámico
    | 'any'       // tipo desconocido/compatible con todo
    | `list<${string}>`
    | `array<${string}>`
    | `queue<${string}>`
    | `stack<${string}>`;

// ============================================================
// Información de una función registrada para el type checker
// ============================================================
interface FunctionSignature {
    returnType: ReType;
    params: Array<{ name: string; type: ReType }>;
    ctx: Function_declContext;
}

// ============================================================
// Ámbito de tipo para variables
// ============================================================
class TypeScope {
    private record: Map<string, ReType> = new Map();
    constructor(public parent: TypeScope | null = null) {}

    define(name: string, type: ReType): void {
        this.record.set(name, type);
    }

    lookup(name: string): ReType | undefined {
        if (this.record.has(name)) return this.record.get(name);
        return this.parent?.lookup(name);
    }

    assign(name: string, type: ReType): void {
        if (this.record.has(name)) {
            this.record.set(name, type);
            return;
        }
        if (this.parent) {
            this.parent.assign(name, type);
            return;
        }
        // Si no existe, lo define (puede pasar con var_assign antes de decl — error de runtime)
    }
}

// ============================================================
// Error de tipo
// ============================================================
export class TypeCheckError {
    constructor(
        public readonly line: number | undefined,
        public readonly col: number | undefined,
        public readonly message: string
    ) {}

    toString(): string {
        const loc = this.line !== undefined ? `Línea ${this.line}:${this.col ?? '?'} ` : '';
        return `[TypeError] ${loc}${this.message}`;
    }
}

// ============================================================
// TYPE CHECKER PRINCIPAL
// ============================================================
export class TypeChecker
    extends AbstractParseTreeVisitor<ReType>
    implements Re_ParserVisitor<ReType>
{
    // Lista de errores encontrados
    public readonly errors: TypeCheckError[] = [];

    // Tabla de funciones registradas
    private functions: Map<string, FunctionSignature> = new Map();

    // Ámbito de tipos actual
    private scope: TypeScope = new TypeScope();

    // Tipo de retorno esperado en la función actual (null = nivel global)
    private expectedReturn: ReType | null = null;

    // -------------------------
    // Resultado por defecto
    // -------------------------
    protected defaultResult(): ReType {
        return 'any';
    }

    // ================================================================
    // Reporte de errores
    // ================================================================
    private error(line: number | undefined, col: number | undefined, msg: string): void {
        this.errors.push(new TypeCheckError(line, col, msg));
    }

    // ================================================================
    // Ejecuta el análisis estático. Devuelve la lista de errores.
    // ================================================================
    static check(ctx: ProgramContext): TypeCheckError[] {
        const checker = new TypeChecker();
        checker.visitProgram(ctx);
        return checker.errors;
    }

    // ================================================================
    // PROGRAMA PRINCIPAL
    // ================================================================
    visitProgram(ctx: ProgramContext): ReType {
        // Pre-registro de funciones
        for (const fnCtx of ctx.function_decl()) {
            this.registerFunction(fnCtx);
        }
        // Verificar todas las sentencias
        for (const sentence of ctx.sentence()) {
            this.visit(sentence);
        }
        return 'void';
    }

    // ================================================================
    // REGISTRO DE FUNCIONES
    // ================================================================
    private registerFunction(ctx: Function_declContext): void {
        const name       = ctx.ID().text;
        const returnType = this.resolveTypeText(
            ctx.type_specifier()?.text ?? ctx.VOID()?.text ?? 'void'
        );

        const params: Array<{ name: string; type: ReType }> = [];
        const paramList = ctx.param_list();
        if (paramList) {
            const typeSpecs = paramList.type_specifier();
            const ids       = paramList.ID();
            for (let i = 0; i < ids.length; i++) {
                params.push({
                    name: ids[i]!.text,
                    type: this.resolveTypeText(typeSpecs[i]?.text ?? 'any'),
                });
            }
        }

        this.functions.set(name, { returnType, params, ctx });
    }

    // ================================================================
    // DECLARACION DE FUNCIONES
    // ================================================================
    visitFunction_decl(ctx: Function_declContext): ReType {
        const sig = this.functions.get(ctx.ID().text);
        if (!sig) return 'void';

        // Crear nuevo ámbito para la función
        const prevScope = this.scope;
        this.scope = new TypeScope(prevScope);

        // Definir parámetros en el nuevo ámbito
        for (const param of sig.params) {
            this.scope.define(param.name, param.type);
        }

        // Establecer el tipo de retorno esperado
        const prevExpectedReturn = this.expectedReturn;
        this.expectedReturn = sig.returnType;

        // Verificar el cuerpo
        for (const sentence of ctx.sentence()) {
            this.visit(sentence);
        }

        // Restaurar
        this.scope = prevScope;
        this.expectedReturn = prevExpectedReturn;
        return 'void';
    }

    // ================================================================
    // DECLARACION DE VARIABLES
    // ================================================================
    visitVar_decl(ctx: Var_declContext): ReType {
        const name        = ctx.ID().text;
        const typeText    = ctx.type_specifier()?.text ?? ctx.VAR()?.text ?? 'var';
        const declaredType = this.resolveTypeText(typeText);

        if (ctx.expression()) {
            const exprType = this.visitExpression(ctx.expression()!);
            // Verificar compatibilidad (excepto 'var' y 'any')
            if (declaredType !== 'var' && declaredType !== 'any' && exprType !== 'any') {
                if (!this.isAssignable(declaredType, exprType)) {
                    const line = ctx.start?.line;
                    const col  = ctx.start?.charPositionInLine;
                    this.error(line, col,
                        `Variable '${name}': se declaró como '${declaredType}' pero se asignó '${exprType}'.`
                    );
                }
            }
        }

        this.scope.define(name, declaredType);
        return declaredType;
    }

    // ================================================================
    // REASIGNACION DE VARIABLES
    // ================================================================
    visitVar_assign(ctx: Var_assignContext): ReType {
        const name         = ctx.ID().text;
        const existingType = this.scope.lookup(name);
        const exprType     = this.visitExpression(ctx.expression());
        const line         = ctx.start?.line;
        const col          = ctx.start?.charPositionInLine;

        if (existingType === undefined) {
            this.error(line, col, `Variable '${name}' no está declarada.`);
        } else if (existingType !== 'var' && existingType !== 'any' && exprType !== 'any') {
            // Para operadores compuestos, verificar compatibilidad
            const op = ctx.PLUS_ASSIGN() ? '+=' : ctx.MINUS_ASSIGN() ? '-=' :
                       ctx.MULT_ASSIGN()  ? '*=' : ctx.DIV_ASSIGN()  ? '/=' : '=';

            if (op !== '=' && op !== '+=') {
                // -=, *=, /= requieren numérico
                if (existingType !== 'int' && existingType !== 'double') {
                    this.error(line, col,
                        `Operador '${op}' requiere una variable numérica, pero '${name}' es '${existingType}'.`
                    );
                }
            }

            if (!this.isAssignable(existingType, exprType)) {
                // Excepción: += con string es concatenación válida
                if (!(op === '+=' && existingType === 'string' && exprType === 'string')) {
                    this.error(line, col,
                        `Variable '${name}' es de tipo '${existingType}' pero se intentó asignar '${exprType}'.`
                    );
                }
            }
        }
        return existingType ?? 'any';
    }

    // ================================================================
    // RETURN
    // ================================================================
    visitReturn_statement(ctx: Return_statementContext): ReType {
        const line = ctx.start?.line;
        const col  = ctx.start?.charPositionInLine;

        if (ctx.expression()) {
            const retType = this.visitExpression(ctx.expression()!);
            if (this.expectedReturn === null) {
                this.error(line, col, `Return con valor fuera de una función.`);
            } else if (this.expectedReturn === 'void') {
                this.error(line, col, `Función void no puede retornar un valor.`);
            } else if (this.expectedReturn !== 'any' && retType !== 'any') {
                if (!this.isAssignable(this.expectedReturn, retType)) {
                    this.error(line, col,
                        `Se esperaba retorno de tipo '${this.expectedReturn}' pero se retornó '${retType}'.`
                    );
                }
            }
            return retType;
        } else {
            // return sin valor
            if (this.expectedReturn !== null && this.expectedReturn !== 'void') {
                this.error(line, col,
                    `La función debe retornar un valor de tipo '${this.expectedReturn}'.`
                );
            }
            return 'void';
        }
    }

    // ================================================================
    // PRINT e INPUT
    // ================================================================
    visitPrint_statement(ctx: Print_statementContext): ReType {
        if (ctx.expression()) this.visitExpression(ctx.expression()!);
        return 'void';
    }

    visitInput_statement(ctx: Input_statementContext): ReType {
        const name = ctx.ID().text;
        const existing = this.scope.lookup(name);
        if (existing === undefined) {
            const line = ctx.start?.line;
            const col  = ctx.start?.charPositionInLine;
            this.error(line, col, `Variable '${name}' no está declarada antes de input().`);
        }
        return 'string';
    }

    // ================================================================
    // IF / WHILE / DO-WHILE / FOR
    // ================================================================
    visitIf_statement(ctx: If_statementContext): ReType {
        for (const expr of ctx.expression()) {
            const condType = this.visitExpression(expr);
            if (condType !== 'bool' && condType !== 'any') {
                const line = ctx.start?.line;
                this.error(line, undefined, `Condición del if debe ser bool, se obtuvo '${condType}'.`);
            }
        }
        for (const s of ctx.sentence()) this.visit(s);
        return 'void';
    }

    visitWhile_statement(ctx: While_statementContext): ReType {
        const condType = this.visitExpression(ctx.expression());
        if (condType !== 'bool' && condType !== 'any') {
            const line = ctx.start?.line;
            this.error(line, undefined, `Condición del while debe ser bool, se obtuvo '${condType}'.`);
        }
        for (const s of ctx.sentence()) this.visit(s);
        return 'void';
    }

    visitDo_while_statement(ctx: Do_while_statementContext): ReType {
        for (const s of ctx.sentence()) this.visit(s);
        const condType = this.visitExpression(ctx.expression());
        if (condType !== 'bool' && condType !== 'any') {
            const line = ctx.start?.line;
            this.error(line, undefined, `Condición del do-while debe ser bool, se obtuvo '${condType}'.`);
        }
        return 'void';
    }

    visitFor_statement(ctx: For_statementContext): ReType {
        const varName = ctx.ID().text;
        // Crear scope para la variable del for
        const prevScope = this.scope;
        this.scope = new TypeScope(prevScope);
        
        // Inferencia del tipo del iterador según la colección o rango
        const iterType = this.checkForExpression(ctx.for_expression());
        this.scope.define(varName, iterType);

        for (const s of ctx.sentence()) this.visit(s);

        this.scope = prevScope;
        return 'void';
    }

    private checkForExpression(ctx: For_expressionContext): ReType {
        const line = ctx.start?.line;
        const col  = ctx.start?.charPositionInLine;

        // Caso 1: Rango (ej: 1..10)
        if (ctx.DOTDOT()) {
            const exprs = ctx.expression();
            const startType = this.visitExpression(exprs[0]!);
            const endType   = this.visitExpression(exprs[1]!);
            if (startType !== 'int' && startType !== 'any') {
                this.error(line, col, `Inicio del rango de for debe ser int, se obtuvo '${startType}'.`);
            }
            if (endType !== 'int' && endType !== 'any') {
                this.error(line, col, `Fin del rango de for debe ser int, se obtuvo '${endType}'.`);
            }
            return 'int';
        }

        // Caso 2: Lista literal (ej: [1, 2, 3])
        if (ctx.list_elements()) {
            const exprs = ctx.list_elements()!.expression();
            if (exprs.length > 0) {
                const firstType = this.visitExpression(exprs[0]!);
                // Verificar que todos sean compatibles
                for (let i = 1; i < exprs.length; i++) {
                    const t = this.visitExpression(exprs[i]!);
                    if (t !== firstType && t !== 'any' && firstType !== 'any') {
                        this.error(line, col, `Elementos de la lista en for tienen tipos mixtos: '${firstType}' y '${t}'.`);
                    }
                }
                return firstType;
            }
            return 'any';
        }

        // Caso 3: Variable
        if (ctx.ID()) {
            const name = ctx.ID()!.text;
            const t = this.scope.lookup(name);
            if (t === undefined) {
                this.error(line, col, `Variable '${name}' no está declarada.`);
                return 'any';
            }
            if (t.startsWith('list<'))   return t.slice(5, -1) as ReType;
            if (t.startsWith('array<'))  return t.slice(6, -1) as ReType;
            if (t.startsWith('queue<'))  return t.slice(6, -1) as ReType;
            if (t.startsWith('stack<'))  return t.slice(6, -1) as ReType;
            if (t === 'any' || t === 'var') return 'any';

            this.error(line, col, `La variable '${name}' de tipo '${t}' no es coleccionable ni iterable.`);
            return 'any';
        }

        return 'any';
    }

    // ================================================================
    // LLAMADA A FUNCIONES
    // ================================================================
    visitFunction_call(ctx: Function_callContext): ReType {
        const name = ctx.ID().text;
        const line = ctx.start?.line;
        const col  = ctx.start?.charPositionInLine;

        // Funciones incorporadas
        const builtins: Record<string, ReType> = {
            'len': 'int', 'size': 'int',
            'to_str': 'string',
            'to_int': 'int',
            'to_double': 'double',
        };
        if (name in builtins) {
            if (ctx.argument_list()) {
                for (const expr of ctx.argument_list()!.expression()) {
                    this.visitExpression(expr);
                }
            }
            return builtins[name] ?? 'any';
        }

        const sig = this.functions.get(name);
        if (!sig) {
            this.error(line, col, `La función '${name}' no está definida.`);
            return 'any';
        }

        // Verificar número de argumentos
        const args = ctx.argument_list()?.expression() ?? [];
        if (args.length !== sig.params.length) {
            this.error(line, col,
                `La función '${name}' espera ${sig.params.length} argumento(s), se recibieron ${args.length}.`
            );
        }

        // Verificar tipos de argumentos
        for (let i = 0; i < Math.min(args.length, sig.params.length); i++) {
            const argType   = this.visitExpression(args[i]!);
            const paramType = sig.params[i]!.type;
            if (paramType !== 'any' && argType !== 'any' && !this.isAssignable(paramType, argType)) {
                this.error(line, col,
                    `Argumento ${i + 1} de '${name}': se esperaba '${paramType}', se recibió '${argType}'.`
                );
            }
        }

        return sig.returnType;
    }

    // ================================================================
    // LLAMADA A MÉTODOS (type-checking básico)
    // ================================================================
    visitMethod_call(ctx: Method_callContext): ReType {
        const objName  = ctx.ID(0).text;
        const method   = ctx.ID(1).text;
        const objType  = this.scope.lookup(objName);
        const line     = ctx.start?.line;
        const col      = ctx.start?.charPositionInLine;

        if (objType === undefined) {
            this.error(line, col, `Variable '${objName}' no está declarada.`);
            return 'any';
        }

        const argsCtx = ctx.argument_list()?.expression() ?? [];
        const argTypes = argsCtx.map(arg => this.visitExpression(arg));

        // Métodos de string
        if (objType === 'string') {
            switch (method) {
                case 'size':
                case 'length':
                    if (argTypes.length !== 0) {
                        this.error(line, col, `Método '.${method}()' de string no espera argumentos, se recibieron ${argTypes.length}.`);
                    }
                    return 'int';
                case 'upper':
                case 'lower':
                case 'toUpperCase':
                case 'toLowerCase':
                    if (argTypes.length !== 0) {
                        this.error(line, col, `Método '.${method}()' de string no espera argumentos, se recibieron ${argTypes.length}.`);
                    }
                    return 'string';
                case 'contains':
                    if (argTypes.length !== 1) {
                        this.error(line, col, `Método '.contains()' de string espera exactamente 1 argumento, se recibieron ${argTypes.length}.`);
                    } else if (argTypes[0] !== 'string' && argTypes[0] !== 'any') {
                        this.error(line, col, `Método '.contains()' espera un argumento tipo string, se obtuvo '${argTypes[0]}'.`);
                    }
                    return 'bool';
                case 'substring':
                    if (argTypes.length < 1 || argTypes.length > 2) {
                        this.error(line, col, `Método '.substring()' espera 1 o 2 argumentos, se recibieron ${argTypes.length}.`);
                    } else {
                        if (argTypes[0] !== 'int' && argTypes[0] !== 'any') {
                            this.error(line, col, `Primer argumento de '.substring()' debe ser int, se obtuvo '${argTypes[0]}'.`);
                        }
                        if (argTypes.length === 2 && argTypes[1] !== 'int' && argTypes[1] !== 'any') {
                            this.error(line, col, `Segundo argumento de '.substring()' debe ser int, se obtuvo '${argTypes[1]}'.`);
                        }
                    }
                    return 'string';
                default:
                    this.error(line, col, `string no tiene el método '${method}'.`);
                    return 'any';
            }
        }

        // Métodos de list<T>
        if (objType.startsWith('list<')) {
            const elemType = objType.slice(5, -1) as ReType;
            switch (method) {
                case 'add':
                    if (argTypes.length !== 1) {
                        this.error(line, col, `Método '.add()' de list espera exactamente 1 argumento, se recibieron ${argTypes.length}.`);
                    } else {
                        if (!this.isAssignable(elemType, argTypes[0]!)) {
                            this.error(line, col, `No se puede agregar un elemento de tipo '${argTypes[0]!}' a una list de tipo '${elemType}'.`);
                        }
                    }
                    return 'void';
                case 'remove':
                    if (argTypes.length !== 1) {
                        this.error(line, col, `Método '.remove()' de list espera exactamente 1 argumento (índice), se recibieron ${argTypes.length}.`);
                    } else if (argTypes[0]! !== 'int' && argTypes[0]! !== 'any') {
                        this.error(line, col, `El índice de '.remove()' debe ser int, se obtuvo '${argTypes[0]!}'.`);
                    }
                    return 'void';
                case 'size':
                    if (argTypes.length !== 0) {
                        this.error(line, col, `Método '.size()' de list no espera argumentos, se recibieron ${argTypes.length}.`);
                    }
                    return 'int';
                case 'get':
                    if (argTypes.length !== 1) {
                        this.error(line, col, `Método '.get()' de list espera exactamente 1 argumento (índice), se recibieron ${argTypes.length}.`);
                    } else if (argTypes[0]! !== 'int' && argTypes[0]! !== 'any') {
                        this.error(line, col, `El índice de '.get()' debe ser int, se obtuvo '${argTypes[0]!}'.`);
                    }
                    return elemType;
                default:
                    this.error(line, col, `list<T> no tiene el método '${method}'.`);
                    return 'any';
            }
        }

        // Métodos de array<T>
        if (objType.startsWith('array<')) {
            const elemType = objType.slice(6, -1) as ReType;
            switch (method) {
                case 'size':
                    if (argTypes.length !== 0) {
                        this.error(line, col, `Método '.size()' de array no espera argumentos, se recibieron ${argTypes.length}.`);
                    }
                    return 'int';
                case 'get':
                    if (argTypes.length !== 1) {
                        this.error(line, col, `Método '.get()' de array espera exactamente 1 argumento (índice), se recibieron ${argTypes.length}.`);
                    } else if (argTypes[0]! !== 'int' && argTypes[0]! !== 'any') {
                        this.error(line, col, `El índice de '.get()' debe ser int, se obtuvo '${argTypes[0]!}'.`);
                    }
                    return elemType;
                default:
                    this.error(line, col, `array<T> no tiene el método '${method}'.`);
                    return 'any';
            }
        }

        // Métodos de queue<T>
        if (objType.startsWith('queue<')) {
            const elemType = objType.slice(6, -1) as ReType;
            switch (method) {
                case 'enqueue':
                    if (argTypes.length !== 1) {
                        this.error(line, col, `Método '.enqueue()' de queue espera exactamente 1 argumento, se recibieron ${argTypes.length}.`);
                    } else {
                        if (!this.isAssignable(elemType, argTypes[0]!)) {
                            this.error(line, col, `No se puede encolar un elemento de tipo '${argTypes[0]!}' en una queue de tipo '${elemType}'.`);
                        }
                    }
                    return 'void';
                case 'dequeue':
                    if (argTypes.length !== 0) {
                        this.error(line, col, `Método '.dequeue()' de queue no espera argumentos, se recibieron ${argTypes.length}.`);
                    }
                    return elemType;
                case 'size':
                    if (argTypes.length !== 0) {
                        this.error(line, col, `Método '.size()' de queue no espera argumentos, se recibieron ${argTypes.length}.`);
                    }
                    return 'int';
                default:
                    this.error(line, col, `queue<T> no tiene el método '${method}'.`);
                    return 'any';
            }
        }

        // Métodos de stack<T>
        if (objType.startsWith('stack<')) {
            const elemType = objType.slice(6, -1) as ReType;
            switch (method) {
                case 'push':
                    if (argTypes.length !== 1) {
                        this.error(line, col, `Método '.push()' de stack espera exactamente 1 argumento, se recibieron ${argTypes.length}.`);
                    } else {
                        if (!this.isAssignable(elemType, argTypes[0]!)) {
                            this.error(line, col, `No se puede apilar un elemento de tipo '${argTypes[0]!}' en un stack de tipo '${elemType}'.`);
                        }
                    }
                    return 'void';
                case 'pop':
                    if (argTypes.length !== 0) {
                        this.error(line, col, `Método '.pop()' de stack no espera argumentos, se recibieron ${argTypes.length}.`);
                    }
                    return elemType;
                case 'size':
                    if (argTypes.length !== 0) {
                        this.error(line, col, `Método '.size()' de stack no espera argumentos, se recibieron ${argTypes.length}.`);
                    }
                    return 'int';
                default:
                    this.error(line, col, `stack<T> no tiene el método '${method}'.`);
                    return 'any';
            }
        }

        return 'any';
    }

    // ================================================================
    // EXPRESIONES - inferencia de tipos
    // ================================================================
    visitExpression(ctx: ExpressionContext): ReType {

        // Literal
        if (ctx.literal()) {
            return this.visitLiteral(ctx.literal()!);
        }

        // Variable sola
        if (ctx.childCount === 1 && ctx.ID()) {
            const name = ctx.ID()!.text;
            const t    = this.scope.lookup(name);
            if (t === undefined) {
                const line = ctx.start?.line;
                const col  = ctx.start?.charPositionInLine;
                this.error(line, col, `Variable '${name}' no está declarada.`);
                return 'any';
            }
            return t;
        }

        // Llamada a función
        if (ctx.function_call()) {
            return this.visitFunction_call(ctx.function_call()!);
        }

        // Llamada a método
        if (ctx.method_call()) {
            return this.visitMethod_call(ctx.method_call()!);
        }

        // Lista literal [a, b, c]
        if (ctx.LBRACKET() && !ctx.ID()) {
            if (ctx.list_elements()) {
                const exprs = ctx.list_elements()!.expression();
                if (exprs.length > 0) {
                    let inferred: ReType = this.visitExpression(exprs[0]!);
                    const line = ctx.start?.line;
                    const col  = ctx.start?.charPositionInLine;
                    for (let i = 1; i < exprs.length; i++) {
                        const next = this.visitExpression(exprs[i]!);
                        if (inferred === 'any' || next === 'any') {
                            inferred = 'any';
                        } else if (inferred === 'int' && next === 'double') {
                            inferred = 'double';
                        } else if (inferred === 'double' && next === 'int') {
                            inferred = 'double';
                        } else if (inferred !== next) {
                            this.error(line, col, `Elementos de la lista tienen tipos mixtos: '${inferred}' y '${next}'.`);
                            inferred = 'any';
                        }
                    }
                    return `list<${inferred}>` as ReType;
                }
            }
            return 'list<any>';
        }

        // Acceso a índice arr[i]
        if (ctx.ID() && ctx.LBRACKET()) {
            const name = ctx.ID()!.text;
            const t    = this.scope.lookup(name);
            if (t && t.startsWith('list<'))  return t.slice(5, -1) as ReType;
            if (t && t.startsWith('array<')) return t.slice(6, -1) as ReType;
            return 'any';
        }

        // Paréntesis
        if (ctx.LPAREN() && ctx.childCount === 3 && !ctx.ID()) {
            return this.visitExpression(ctx.expression(0)!);
        }

        // Negación unaria not / !
        if ((ctx.NOT_KW() || ctx.NOT_OP()) && ctx.childCount === 2) {
            this.visitExpression(ctx.expression(0)!);
            return 'bool';
        }

        // Menos unario
        if (ctx.MINUS() && ctx.childCount === 2) {
            const t = this.visitExpression(ctx.expression(0)!);
            if (t !== 'int' && t !== 'double' && t !== 'any' && t !== 'var') {
                const line = ctx.start?.line;
                const col  = ctx.start?.charPositionInLine;
                this.error(line, col, `Operador '-' unario requiere tipo numérico, se recibió '${t}'.`);
            }
            return (t === 'double') ? 'double' : 'int';
        }

        // Operación binaria
        if (ctx.childCount === 3) {
            const left  = this.visitExpression(ctx.expression(0)!);
            const right = this.visitExpression(ctx.expression(1)!);
            const op    = ctx.getChild(1).text;
            const line  = ctx.start?.line;
            const col   = ctx.start?.charPositionInLine;

            switch (op) {
                case '+':
                    if (left === 'string' || right === 'string') return 'string';
                    // Si no es string, ambos deben ser numéricos
                    if (left !== 'int' && left !== 'double' && left !== 'any' && left !== 'var') {
                        this.error(line, col, `Operando izquierdo de '+' debe ser numérico o string, se recibió '${left}'.`);
                    }
                    if (right !== 'int' && right !== 'double' && right !== 'any' && right !== 'var') {
                        this.error(line, col, `Operando derecho de '+' debe ser numérico o string, se recibió '${right}'.`);
                    }
                    if (left === 'double' || right === 'double') return 'double';
                    return 'int';
                case '-':
                case '*':
                case '/':
                case '^':
                    if (left !== 'int' && left !== 'double' && left !== 'any' && left !== 'var') {
                        this.error(line, col, `Operando izquierdo de '${op}' debe ser numérico, se recibió '${left}'.`);
                    }
                    if (right !== 'int' && right !== 'double' && right !== 'any' && right !== 'var') {
                        this.error(line, col, `Operando derecho de '${op}' debe ser numérico, se recibió '${right}'.`);
                    }
                    if (op === '/') return 'double';
                    if (op === '^') return 'double';
                    if (left === 'double' || right === 'double') return 'double';
                    return 'int';
                case '==': case '!=':
                    return 'bool';
                case '>':  case '<':
                case '>=': case '<=':
                    if (left !== 'int' && left !== 'double' && left !== 'any' && left !== 'var') {
                        this.error(line, col, `Operando izquierdo de '${op}' debe ser numérico, se recibió '${left}'.`);
                    }
                    if (right !== 'int' && right !== 'double' && right !== 'any' && right !== 'var') {
                        this.error(line, col, `Operando derecho de '${op}' debe ser numérico, se recibió '${right}'.`);
                    }
                    return 'bool';
                case 'and': case '&&':
                case 'or':  case '||':
                    if (left !== 'bool' && left !== 'any' && left !== 'var') {
                        this.error(line, col, `Operando izquierdo de '${op}' debe ser bool, se recibió '${left}'.`);
                    }
                    if (right !== 'bool' && right !== 'any' && right !== 'var') {
                        this.error(line, col, `Operando derecho de '${op}' debe ser bool, se recibió '${right}'.`);
                    }
                    return 'bool';
                default:
                    return 'any';
            }
        }

        return 'any';
    }

    // ================================================================
    // LITERAL - inferencia de tipo
    // ================================================================
    visitLiteral(ctx: LiteralContext): ReType {
        if (ctx.INT())    return 'int';
        if (ctx.DOUBLE()) return 'double';
        if (ctx.STRING()) return 'string';
        if (ctx.BOOL())   return 'bool';
        return 'any';
    }

    // ================================================================
    // HELPERS
    // ================================================================

    /** Convierte texto del parser a ReType */
    private resolveTypeText(text: string): ReType {
        // Normalizar tipos genéricos removiendo espacios
        const normalized = text.replace(/\s/g, '');
        switch (normalized) {
            case 'int':
            case 'short':
            case 'long':    return 'int';
            case 'double':  return 'double';
            case 'string':  return 'string';
            case 'bool':    return 'bool';
            case 'void':    return 'void';
            case 'var':     return 'var';
            default:
                // list<int>, array<double>, etc.
                if (normalized.startsWith('list<'))       return normalized as ReType;
                if (normalized.startsWith('array<'))      return normalized as ReType;
                if (normalized.startsWith('queue<'))      return normalized as ReType;
                if (normalized.startsWith('stack<'))      return normalized as ReType;
                return 'any';
        }
    }

    /**
     * ¿Puede asignarse 'valueType' a una variable de tipo 'targetType'?
     * Reglas:
     *   - any es compatible con todo
     *   - var acepta cualquier cosa
     *   - int ← double con truncamiento (permitido para compatibilidad)
     *   - los demás deben coincidir exactamente
     */
    private isAssignable(targetType: ReType, valueType: ReType): boolean {
        if (targetType === 'any' || valueType === 'any') return true;
        if (targetType === 'var') return true;
        if (targetType === valueType) return true;
        // double puede recibir int
        if (targetType === 'double' && valueType === 'int') return true;

        // Asignación de colecciones (ej. list/array literal a list/array/queue/stack)
        const getOuterAndInner = (t: string) => {
            const idx = t.indexOf('<');
            if (idx === -1) return null;
            return {
                outer: t.substring(0, idx),
                inner: t.substring(idx + 1, t.length - 1)
            };
        };

        const targetCol = getOuterAndInner(targetType);
        const valueCol = getOuterAndInner(valueType);
        if (targetCol && valueCol) {
            // El tipo del elemento debe ser asignable
            return this.isAssignable(targetCol.inner as ReType, valueCol.inner as ReType);
        }

        return false;
    }
}
