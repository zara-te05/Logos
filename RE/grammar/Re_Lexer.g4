lexer grammar Re_Lexer;

// === KEYWORDS ===
PROGRAM  : 'program';
STATIC   : 'static';
VOID     : 'void';
PRINT    : 'print';
INPUT    : 'input';
RETURN   : 'return';
FUNCTION : 'function';

// === TYPES ===
VAR         : 'var';
INT_TYPE    : 'int';
DOUBLE_TYPE : 'double';
LONG_TYPE   : 'long';
SHORT_TYPE  : 'short';
BOOL_TYPE   : 'bool';
STRING_TYPE : 'string';
ARRAY_TYPE  : 'array'; // Cambiado a palabra clave para usar array<T>
LIST_TYPE   : 'list';
QUEUE       : 'queue'; 
STACK       : 'stack';

// === OPERATORS ===
PLUS   : '+';
MINUS  : '-';
MULT   : '*';
DIV    : '/';
EXP    : '^';
ASSIGN : '=';

// === COMPOUND ASSIGNMENT OPERATORS ===
PLUS_ASSIGN  : '+=' ;
MINUS_ASSIGN : '-=' ;
MULT_ASSIGN  : '*=' ;
DIV_ASSIGN   : '/=' ;

// === LOGIC OPERATORS (Clásicos y Python) ===
AND_KW : 'and' ;
OR_KW  : 'or' ;
NOT_KW : 'not' ;

AND_OP : '&&' ;
OR_OP  : '||' ;
NOT_OP : '!' ;
IN     : 'in' ;

// === COMPARISON OPERATORS ===
EQ     : '==' ;
NEQ    : '!=' ;
GTE    : '>=' ;
LTE    : '<=' ;
GT     : '>' ;
LT     : '<' ;
DOTDOT : '..' ;

// === PUNCTUATION ===
DOT      : '.' ;
COLON    : ':' ;
SEMI     : ';' ;
COMMA    : ',' ;
LPAREN   : '(' ;
RPAREN   : ')' ;
LBRACE   : '{' ;
RBRACE   : '}' ;
LBRACKET : '[' ;
RBRACKET : ']' ;

// === CONTROL FLOW ===
IF    : 'if';
ELSE  : 'else';
FOR   : 'for';
WHILE : 'while';
DO    : 'do';

// === LITERALS ===
INT    : [0-9]+ ;
DOUBLE : [0-9]+ '.' [0-9]+ | '.' [0-9]+ ;
STRING : '"' .*? '"' ;
BOOL   : 'true' | 'false';

ID : [a-zA-Z_][a-zA-Z0-9_]* ;

// === WHITE SPACE ===
WS : [ \t\r\n]+ -> skip;

// === COMENTARIOS ===
LINE_COMMENT  : '//' ~[\r\n]* -> skip;
BLOCK_COMMENT : '/*' .*? '*/' -> skip;