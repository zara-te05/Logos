// Generated from Re_Parser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `Re_Parser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface Re_ParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `Re_Parser.program`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgram?: (ctx: ProgramContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.function_decl`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunction_decl?: (ctx: Function_declContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.param_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParam_list?: (ctx: Param_listContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.sentence`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSentence?: (ctx: SentenceContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.print_statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrint_statement?: (ctx: Print_statementContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.input_statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInput_statement?: (ctx: Input_statementContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.var_decl`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVar_decl?: (ctx: Var_declContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.var_assign`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVar_assign?: (ctx: Var_assignContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.return_statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturn_statement?: (ctx: Return_statementContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.type_specifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitType_specifier?: (ctx: Type_specifierContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.primitive_type`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrimitive_type?: (ctx: Primitive_typeContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.list_type`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitList_type?: (ctx: List_typeContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.array_type`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArray_type?: (ctx: Array_typeContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.collection_type`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCollection_type?: (ctx: Collection_typeContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.function_call`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunction_call?: (ctx: Function_callContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.method_call`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMethod_call?: (ctx: Method_callContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.argument_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArgument_list?: (ctx: Argument_listContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.literal`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLiteral?: (ctx: LiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.if_statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIf_statement?: (ctx: If_statementContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.while_statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWhile_statement?: (ctx: While_statementContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.do_while_statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDo_while_statement?: (ctx: Do_while_statementContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.for_statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFor_statement?: (ctx: For_statementContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.for_expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFor_expression?: (ctx: For_expressionContext) => Result;

	/**
	 * Visit a parse tree produced by `Re_Parser.list_elements`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitList_elements?: (ctx: List_elementsContext) => Result;
}

