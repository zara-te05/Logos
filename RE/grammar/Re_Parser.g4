parser grammar Re_Parser;

options {
    tokenVocab = Re_Lexer;
}

// === REGLA INICIAL ===
program
    : PROGRAM ID LBRACE (sentence | function_decl)* RBRACE
    ;

// === FUNCIONES ===
function_decl
    : (type_specifier | VOID) ID LPAREN param_list? RPAREN LBRACE sentence* RBRACE
    ;

param_list
    : type_specifier ID (COMMA type_specifier ID)*
    ;

// === ESTRUCTURAS DE CONTROL Y SENTENCIAS ===
sentence
    : var_decl
    | var_assign
    | print_statement 
    | input_statement
    | if_statement
    | while_statement
    | do_while_statement
    | for_statement
    | return_statement
    | function_call SEMI
    | method_call SEMI
    ;

print_statement
    : PRINT LPAREN expression? RPAREN SEMI 
    ;

input_statement
    : ID ASSIGN INPUT LPAREN STRING? RPAREN SEMI
    ;

var_decl
    : (type_specifier | VAR) ID (ASSIGN expression)? SEMI 
    ;

var_assign
    : ID (ASSIGN | PLUS_ASSIGN | MINUS_ASSIGN | MULT_ASSIGN | DIV_ASSIGN) expression SEMI
    ;

return_statement
    : RETURN expression? SEMI
    ;

// === TIPOS DE DATOS ===
type_specifier
    : primitive_type
    | list_type
    | array_type
    | collection_type
    ;

primitive_type
    : INT_TYPE | DOUBLE_TYPE | LONG_TYPE | SHORT_TYPE | STRING_TYPE | BOOL_TYPE
    ;

list_type
    : LIST_TYPE LT primitive_type GT
    ;   

array_type 
    : ARRAY_TYPE LT primitive_type GT  // Cambiado a: array<int> en lugar de int[]
    ;

collection_type
    : (QUEUE | STACK) LT primitive_type GT
    ;

// === EXPRESIONES (Precedencia de ANTLR4) ===
expression
    : expression (OR_KW | OR_OP) expression
    | expression (AND_KW | AND_OP) expression
    | expression (GTE | GT | LTE | LT | EQ | NEQ) expression
    | expression (PLUS | MINUS) expression
    | expression (MULT | DIV) expression
    | <assoc=right> expression EXP expression 
    | (NOT_KW | NOT_OP) expression            // Sube aquí (Mayor prioridad que binarios)
    | MINUS expression                        // Sube aquí (El menos unario, ej: -5)
    | LPAREN expression RPAREN                
    | literal
    | ID
    | function_call
    | method_call
    | ID LBRACKET expression RBRACKET         
    | LBRACKET list_elements? RBRACKET        // array/list literal: [1, 2, 3]
    ;
function_call
    : ID LPAREN argument_list? RPAREN
    ;

method_call
    : ID DOT ID LPAREN argument_list? RPAREN
    ;

argument_list
    : expression (COMMA expression)*
    ;

literal
    : INT | DOUBLE | STRING | BOOL
    ;

// === CONDICIONAL IF ===
// CORREGIDO: 'else if' se maneja como ELSE IF, no como un solo token
if_statement
    : IF LPAREN expression RPAREN LBRACE sentence* RBRACE 
      (ELSE IF LPAREN expression RPAREN LBRACE sentence* RBRACE)*
      (ELSE LBRACE sentence* RBRACE)?
    ;

// === BUCLES ===
while_statement
    : WHILE LPAREN expression RPAREN (LBRACE sentence* RBRACE | sentence)
    ;

do_while_statement
    : DO LBRACE sentence* RBRACE WHILE LPAREN expression RPAREN SEMI
    ;

for_statement
    : FOR ID IN for_expression (LBRACE sentence* RBRACE | sentence)
    ;

for_expression
    : expression DOTDOT expression       
    | LBRACKET list_elements? RBRACKET   
    | ID                                 
    ;

list_elements
    : expression (COMMA expression)*     
    ;