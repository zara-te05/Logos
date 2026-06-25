import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { Re_Lexer } from '../compiler.core/Re_Lexer.js';
import { Re_Parser } from '../compiler.core/Re_Parser.js';
import { Interpreter } from '../compiler.core/Enviroment/Interpreter.js';
import { TypeChecker } from '../compiler.core/Enviroment/TypeChecker.js';

// =============================================
// Programa de prueba completo en lenguaje "Re"
// Sesión 2: Nuevas funcionalidades
// =============================================
const sourceCode = `
program PruebaCompleta {

    // === Funciones declaradas al inicio del bloque ===
    int cuadrado(int n) {
        return n * n;
    }

    string saludar(string quien) {
        return "Hola, " + quien;
    }

    // === PRUEBA 1: Tipos basicos (Sesion 1) ===
    int edad = 5;
    double precio = 9.99;
    string nombre = "Ana";
    bool activo = true;

    print(edad);
    print(precio);
    print(nombre);
    print(activo);

    // === PRUEBA 2: Operaciones aritmeticas ===
    int suma = edad + 5;
    print(suma);
    print(2 ^ 8);

    // === PRUEBA 3: Concatenacion de strings ===
    print("Hola, " + nombre);

    // === PRUEBA 4: If / else ===
    if (edad >= 18) {
        print("Es mayor de edad");
    } else {
        print("Es menor de edad");
    }

    // === PRUEBA 5: While ===
    int contador = 0;
    while (contador < 3) {
        print(contador);
        contador = contador + 1;
    }

    // === PRUEBA 6: For con rango ===
    for i in 1..5 {
        print(i);
    }

    // === PRUEBA 7: Funciones con return ===
    int resultado = cuadrado(7);
    print(resultado);

    string msg = saludar("Mundo");
    print(msg);

    // ==========================================================
    // === NUEVAS PRUEBAS - SESION 2 ============================
    // ==========================================================

    // === PRUEBA 8: Operadores de asignacion compuesta ===
    print("--- Prueba +=, -=, *=, /= ---");
    int x = 10;
    x += 5;
    print(x);

    x -= 3;
    print(x);

    x *= 2;
    print(x);

    x /= 4;
    print(x);

    string s = "Hola";
    s += ", Mundo";
    print(s);

    // === PRUEBA 9: list<T> con .add(), .size(), .remove(), for-in ===
    print("--- Prueba list<int> ---");
    list<int> numeros = [10, 20, 30];
    print(numeros);

    numeros.add(40);
    numeros.add(50);
    print(numeros);

    print(numeros.size());

    numeros.remove(0);
    print(numeros);

    for n in numeros {
        print(n);
    }

    // === PRUEBA 10: array<T> con acceso por indice y for-in ===
    print("--- Prueba array<int> ---");
    array<int> arr = [1, 2, 3, 4, 5];
    print(arr);
    print(arr.size());

    for item in arr {
        print(item);
    }

    // === PRUEBA 11: Acceso por indice ===
    print("--- Acceso por indice ---");
    print(numeros[0]);
    print(arr[2]);

    // === PRUEBA 12: list<string> ===
    print("--- Prueba list<string> ---");
    list<string> frutas = ["manzana", "pera", "uva"];
    frutas.add("mango");
    print(frutas);
    print(frutas.size());

    // === PRUEBA 13: Funciones de conversion ===
    print("--- Conversion de tipos ---");
    int numero = to_int("42");
    print(numero);
    string texto = to_str(3.14);
    print(texto);

    // === PRUEBA 14: Metodos de string ===
    print("--- Metodos de string ---");
    string saludo = "hola mundo";
    print(saludo.upper());
    print(saludo.size());

}
`;

const input = CharStreams.fromString(sourceCode);
const lexer = new Re_Lexer(input);
const tokens = new CommonTokenStream(lexer);
const parser = new Re_Parser(tokens);
const tree = parser.program();

// =============================================
// FASE 1: Análisis estático de tipos
// =============================================
const typeErrors = TypeChecker.check(tree);
if (typeErrors.length > 0) {
    console.error('\n=== ERRORES DE TIPO DETECTADOS ANTES DE EJECUTAR ===');
    for (const err of typeErrors) {
        console.error(err.toString());
    }
    console.error('=== El programa no se ejecutará hasta corregir los errores ===\n');
    process.exit(1);
}

// =============================================
// FASE 2: Ejecución del intérprete
// =============================================
const interpreter = new Interpreter();
interpreter.visit(tree);