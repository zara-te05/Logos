import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { Re_Lexer } from '../compiler.core/Re_Lexer.js';
import { Re_Parser } from '../compiler.core/Re_Parser.js';
import { Interpreter } from '../compiler.core/Enviroment/Interpreter.js';
import { TypeChecker } from '../compiler.core/Enviroment/TypeChecker.js';

// =============================================
// Programa 1: Pruebas de Queue y Stack (Válido)
// =============================================
const validSource = `
program PruebaColecciones {
    print("=== PROBANDO QUEUE ===");
    queue<int> cola = [10, 20];
    print(cola);
    print(cola.size());

    cola.enqueue(30);
    print(cola);
    print(cola.size());

    int x = cola.dequeue();
    print("Dequeued: " + to_str(x));
    print(cola);

    print("=== PROBANDO STACK ===");
    stack<string> pila = ["A", "B"];
    print(pila);
    print(pila.size());

    pila.push("C");
    print(pila);

    string s = pila.pop();
    print("Popped: " + s);
    print(pila);

    print("=== PROBANDO INFERENCIA DE FOR-IN ===");
    list<int> lista = [1, 2, 3];
    for val in lista {
        // val es inferido como int, por lo que podemos hacer operaciones matemáticas
        int calc = val * 10;
        print(calc);
    }
}
`;

// =============================================
// Programa 2: Pruebas de TypeChecker (Inválido)
// =============================================
const invalidSource = `
program PruebaErrores {
    // 1. Operaciones incompatibles
    int a = 5;
    string b = "hola";
    int c = a - b; // Error: operando derecho de '-' debe ser numérico

    // 2. Elemento incorrecto en add de list
    list<int> numeros = [1, 2, 3];
    numeros.add("texto"); // Error: no se puede agregar string a list<int>

    // 3. Cola incorrecta
    queue<double> colaValores = [1.1, 2.2];
    colaValores.enqueue("incorrecto"); // Error: no se puede encolar string en queue<double>

    // 4. Elementos de lista de tipos mixtos
    list<int> mixta = [1, 2, "tres"]; // Error: tipos mixtos
}
`;

function runTest(name: string, source: string) {
    console.log(`\n-------------------------------------`);
    console.log(`EJECUTANDO TEST: ${name}`);
    console.log(`-------------------------------------`);

    const input = CharStreams.fromString(source);
    const lexer = new Re_Lexer(input);
    const tokens = new CommonTokenStream(lexer);
    const parser = new Re_Parser(tokens);
    const tree = parser.program();

    const typeErrors = TypeChecker.check(tree);
    if (typeErrors.length > 0) {
        console.log(`[TypeChecker] Se detectaron ${typeErrors.length} errores de tipo:`);
        for (const err of typeErrors) {
            console.log("  -> " + err.toString());
        }
        return;
    }

    console.log("[TypeChecker] Todo correcto. Ejecutando intérprete...");
    try {
        const interpreter = new Interpreter();
        interpreter.visit(tree);
    } catch (e: any) {
        console.error("[Runtime Error]", e.message);
    }
}

runTest("Colecciones válidas (Queue, Stack, For-in)", validSource);
runTest("Errores del TypeChecker (Incompatibilidades)", invalidSource);
