import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { Re_Lexer } from '../compiler.core/Re_Lexer.js';
import { Re_Parser } from '../compiler.core/Re_Parser.js';
import { Interpreter } from '../compiler.core/Enviroment/Interpreter.js';

const sourceCode = `
program PruebaInput {
    var nombre = "";
    nombre = input("¿Cuál es tu nombre? ");
    print("Hola, " + nombre + "!");

    var edad = "";
    edad = input("¿Cuántos años tienes? ");
    print("Tienes " + edad + " años.");
}
`;

const input = CharStreams.fromString(sourceCode);
const lexer = new Re_Lexer(input);
const tokens = new CommonTokenStream(lexer);
const parser = new Re_Parser(tokens);
const tree = parser.program();

const interpreter = new Interpreter();
interpreter.visit(tree);
