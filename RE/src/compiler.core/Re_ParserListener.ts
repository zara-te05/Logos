// Generated from Re_Parser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { ProgramContext } from "./Re_Parser";
import { Function_declContext } from "./Re_Parser";
import { Param_listContext } from "./Re_Parser";
import { SentenceContext } from "./Re_Parser";
import { Print_statementContext } from "./Re_Parser";
import { Input_statementContext } from "./Re_Parser";
import { Var_declContext } from "./Re_Parser";
import { Var_assignContext } from "./Re_Parser";
import { Return_statementContext } from "./Re_Parser";
import { Type_specifierContext } from "./Re_Parser";
import { Primitive_typeContext } from "./Re_Parser";
import { List_typeContext } from "./Re_Parser";
import { Array_typeContext } from "./Re_Parser";
import { Collection_typeContext } from "./Re_Parser";
import { ExpressionContext } from "./Re_Parser";
import { Function_callContext } from "./Re_Parser";
import { Method_callContext } from "./Re_Parser";
import { Argument_listContext } from "./Re_Parser";
import { LiteralContext } from "./Re_Parser";
import { If_statementContext } from "./Re_Parser";
import { While_statementContext } from "./Re_Parser";
import { Do_while_statementContext } from "./Re_Parser";
import { For_statementContext } from "./Re_Parser";
import { For_expressionContext } from "./Re_Parser";
import { List_elementsContext } from "./Re_Parser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `Re_Parser`.
 */
export interface Re_ParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `Re_Parser.program`.
	 * @param ctx the parse tree
	 */
	enterProgram?: (ctx: ProgramContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.program`.
	 * @param ctx the parse tree
	 */
	exitProgram?: (ctx: ProgramContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.function_decl`.
	 * @param ctx the parse tree
	 */
	enterFunction_decl?: (ctx: Function_declContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.function_decl`.
	 * @param ctx the parse tree
	 */
	exitFunction_decl?: (ctx: Function_declContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.param_list`.
	 * @param ctx the parse tree
	 */
	enterParam_list?: (ctx: Param_listContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.param_list`.
	 * @param ctx the parse tree
	 */
	exitParam_list?: (ctx: Param_listContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.sentence`.
	 * @param ctx the parse tree
	 */
	enterSentence?: (ctx: SentenceContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.sentence`.
	 * @param ctx the parse tree
	 */
	exitSentence?: (ctx: SentenceContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.print_statement`.
	 * @param ctx the parse tree
	 */
	enterPrint_statement?: (ctx: Print_statementContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.print_statement`.
	 * @param ctx the parse tree
	 */
	exitPrint_statement?: (ctx: Print_statementContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.input_statement`.
	 * @param ctx the parse tree
	 */
	enterInput_statement?: (ctx: Input_statementContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.input_statement`.
	 * @param ctx the parse tree
	 */
	exitInput_statement?: (ctx: Input_statementContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.var_decl`.
	 * @param ctx the parse tree
	 */
	enterVar_decl?: (ctx: Var_declContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.var_decl`.
	 * @param ctx the parse tree
	 */
	exitVar_decl?: (ctx: Var_declContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.var_assign`.
	 * @param ctx the parse tree
	 */
	enterVar_assign?: (ctx: Var_assignContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.var_assign`.
	 * @param ctx the parse tree
	 */
	exitVar_assign?: (ctx: Var_assignContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.return_statement`.
	 * @param ctx the parse tree
	 */
	enterReturn_statement?: (ctx: Return_statementContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.return_statement`.
	 * @param ctx the parse tree
	 */
	exitReturn_statement?: (ctx: Return_statementContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.type_specifier`.
	 * @param ctx the parse tree
	 */
	enterType_specifier?: (ctx: Type_specifierContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.type_specifier`.
	 * @param ctx the parse tree
	 */
	exitType_specifier?: (ctx: Type_specifierContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.primitive_type`.
	 * @param ctx the parse tree
	 */
	enterPrimitive_type?: (ctx: Primitive_typeContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.primitive_type`.
	 * @param ctx the parse tree
	 */
	exitPrimitive_type?: (ctx: Primitive_typeContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.list_type`.
	 * @param ctx the parse tree
	 */
	enterList_type?: (ctx: List_typeContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.list_type`.
	 * @param ctx the parse tree
	 */
	exitList_type?: (ctx: List_typeContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.array_type`.
	 * @param ctx the parse tree
	 */
	enterArray_type?: (ctx: Array_typeContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.array_type`.
	 * @param ctx the parse tree
	 */
	exitArray_type?: (ctx: Array_typeContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.collection_type`.
	 * @param ctx the parse tree
	 */
	enterCollection_type?: (ctx: Collection_typeContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.collection_type`.
	 * @param ctx the parse tree
	 */
	exitCollection_type?: (ctx: Collection_typeContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.function_call`.
	 * @param ctx the parse tree
	 */
	enterFunction_call?: (ctx: Function_callContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.function_call`.
	 * @param ctx the parse tree
	 */
	exitFunction_call?: (ctx: Function_callContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.method_call`.
	 * @param ctx the parse tree
	 */
	enterMethod_call?: (ctx: Method_callContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.method_call`.
	 * @param ctx the parse tree
	 */
	exitMethod_call?: (ctx: Method_callContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.argument_list`.
	 * @param ctx the parse tree
	 */
	enterArgument_list?: (ctx: Argument_listContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.argument_list`.
	 * @param ctx the parse tree
	 */
	exitArgument_list?: (ctx: Argument_listContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.literal`.
	 * @param ctx the parse tree
	 */
	enterLiteral?: (ctx: LiteralContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.literal`.
	 * @param ctx the parse tree
	 */
	exitLiteral?: (ctx: LiteralContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.if_statement`.
	 * @param ctx the parse tree
	 */
	enterIf_statement?: (ctx: If_statementContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.if_statement`.
	 * @param ctx the parse tree
	 */
	exitIf_statement?: (ctx: If_statementContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.while_statement`.
	 * @param ctx the parse tree
	 */
	enterWhile_statement?: (ctx: While_statementContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.while_statement`.
	 * @param ctx the parse tree
	 */
	exitWhile_statement?: (ctx: While_statementContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.do_while_statement`.
	 * @param ctx the parse tree
	 */
	enterDo_while_statement?: (ctx: Do_while_statementContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.do_while_statement`.
	 * @param ctx the parse tree
	 */
	exitDo_while_statement?: (ctx: Do_while_statementContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.for_statement`.
	 * @param ctx the parse tree
	 */
	enterFor_statement?: (ctx: For_statementContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.for_statement`.
	 * @param ctx the parse tree
	 */
	exitFor_statement?: (ctx: For_statementContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.for_expression`.
	 * @param ctx the parse tree
	 */
	enterFor_expression?: (ctx: For_expressionContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.for_expression`.
	 * @param ctx the parse tree
	 */
	exitFor_expression?: (ctx: For_expressionContext) => void;

	/**
	 * Enter a parse tree produced by `Re_Parser.list_elements`.
	 * @param ctx the parse tree
	 */
	enterList_elements?: (ctx: List_elementsContext) => void;
	/**
	 * Exit a parse tree produced by `Re_Parser.list_elements`.
	 * @param ctx the parse tree
	 */
	exitList_elements?: (ctx: List_elementsContext) => void;
}

