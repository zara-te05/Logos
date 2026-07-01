// Generated from Re_Parser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { Re_ParserListener } from "./Re_ParserListener";
import { Re_ParserVisitor } from "./Re_ParserVisitor";


export class Re_Parser extends Parser {
	public static readonly PROGRAM = 1;
	public static readonly STATIC = 2;
	public static readonly VOID = 3;
	public static readonly PRINT = 4;
	public static readonly INPUT = 5;
	public static readonly RETURN = 6;
	public static readonly FUNCTION = 7;
	public static readonly VAR = 8;
	public static readonly INT_TYPE = 9;
	public static readonly DOUBLE_TYPE = 10;
	public static readonly LONG_TYPE = 11;
	public static readonly SHORT_TYPE = 12;
	public static readonly BOOL_TYPE = 13;
	public static readonly STRING_TYPE = 14;
	public static readonly ARRAY_TYPE = 15;
	public static readonly LIST_TYPE = 16;
	public static readonly QUEUE = 17;
	public static readonly STACK = 18;
	public static readonly PLUS = 19;
	public static readonly MINUS = 20;
	public static readonly MULT = 21;
	public static readonly DIV = 22;
	public static readonly EXP = 23;
	public static readonly ASSIGN = 24;
	public static readonly PLUS_ASSIGN = 25;
	public static readonly MINUS_ASSIGN = 26;
	public static readonly MULT_ASSIGN = 27;
	public static readonly DIV_ASSIGN = 28;
	public static readonly AND_KW = 29;
	public static readonly OR_KW = 30;
	public static readonly NOT_KW = 31;
	public static readonly AND_OP = 32;
	public static readonly OR_OP = 33;
	public static readonly NOT_OP = 34;
	public static readonly IN = 35;
	public static readonly EQ = 36;
	public static readonly NEQ = 37;
	public static readonly GTE = 38;
	public static readonly LTE = 39;
	public static readonly GT = 40;
	public static readonly LT = 41;
	public static readonly DOTDOT = 42;
	public static readonly DOT = 43;
	public static readonly COLON = 44;
	public static readonly SEMI = 45;
	public static readonly COMMA = 46;
	public static readonly LPAREN = 47;
	public static readonly RPAREN = 48;
	public static readonly LBRACE = 49;
	public static readonly RBRACE = 50;
	public static readonly LBRACKET = 51;
	public static readonly RBRACKET = 52;
	public static readonly IF = 53;
	public static readonly ELSE = 54;
	public static readonly FOR = 55;
	public static readonly WHILE = 56;
	public static readonly DO = 57;
	public static readonly INT = 58;
	public static readonly DOUBLE = 59;
	public static readonly STRING = 60;
	public static readonly BOOL = 61;
	public static readonly ID = 62;
	public static readonly WS = 63;
	public static readonly LINE_COMMENT = 64;
	public static readonly BLOCK_COMMENT = 65;
	public static readonly RULE_program = 0;
	public static readonly RULE_function_decl = 1;
	public static readonly RULE_param_list = 2;
	public static readonly RULE_sentence = 3;
	public static readonly RULE_print_statement = 4;
	public static readonly RULE_var_decl = 5;
	public static readonly RULE_var_assign = 6;
	public static readonly RULE_return_statement = 7;
	public static readonly RULE_type_specifier = 8;
	public static readonly RULE_primitive_type = 9;
	public static readonly RULE_list_type = 10;
	public static readonly RULE_array_type = 11;
	public static readonly RULE_collection_type = 12;
	public static readonly RULE_expression = 13;
	public static readonly RULE_function_call = 14;
	public static readonly RULE_method_call = 15;
	public static readonly RULE_argument_list = 16;
	public static readonly RULE_literal = 17;
	public static readonly RULE_if_statement = 18;
	public static readonly RULE_while_statement = 19;
	public static readonly RULE_do_while_statement = 20;
	public static readonly RULE_for_statement = 21;
	public static readonly RULE_for_expression = 22;
	public static readonly RULE_list_elements = 23;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"program", "function_decl", "param_list", "sentence", "print_statement", 
		"var_decl", "var_assign", "return_statement", "type_specifier", "primitive_type", 
		"list_type", "array_type", "collection_type", "expression", "function_call", 
		"method_call", "argument_list", "literal", "if_statement", "while_statement", 
		"do_while_statement", "for_statement", "for_expression", "list_elements",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'program'", "'static'", "'void'", "'print'", "'input'", "'return'", 
		"'function'", "'var'", "'int'", "'double'", "'long'", "'short'", "'bool'", 
		"'string'", "'array'", "'list'", "'queue'", "'stack'", "'+'", "'-'", "'*'", 
		"'/'", "'^'", "'='", "'+='", "'-='", "'*='", "'/='", "'and'", "'or'", 
		"'not'", "'&&'", "'||'", "'!'", "'in'", "'=='", "'!='", "'>='", "'<='", 
		"'>'", "'<'", "'..'", "'.'", "':'", "';'", "','", "'('", "')'", "'{'", 
		"'}'", "'['", "']'", "'if'", "'else'", "'for'", "'while'", "'do'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "PROGRAM", "STATIC", "VOID", "PRINT", "INPUT", "RETURN", "FUNCTION", 
		"VAR", "INT_TYPE", "DOUBLE_TYPE", "LONG_TYPE", "SHORT_TYPE", "BOOL_TYPE", 
		"STRING_TYPE", "ARRAY_TYPE", "LIST_TYPE", "QUEUE", "STACK", "PLUS", "MINUS", 
		"MULT", "DIV", "EXP", "ASSIGN", "PLUS_ASSIGN", "MINUS_ASSIGN", "MULT_ASSIGN", 
		"DIV_ASSIGN", "AND_KW", "OR_KW", "NOT_KW", "AND_OP", "OR_OP", "NOT_OP", 
		"IN", "EQ", "NEQ", "GTE", "LTE", "GT", "LT", "DOTDOT", "DOT", "COLON", 
		"SEMI", "COMMA", "LPAREN", "RPAREN", "LBRACE", "RBRACE", "LBRACKET", "RBRACKET", 
		"IF", "ELSE", "FOR", "WHILE", "DO", "INT", "DOUBLE", "STRING", "BOOL", 
		"ID", "WS", "LINE_COMMENT", "BLOCK_COMMENT",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(Re_Parser._LITERAL_NAMES, Re_Parser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return Re_Parser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "Re_Parser.g4"; }

	// @Override
	public get ruleNames(): string[] { return Re_Parser.ruleNames; }

	// @Override
	public get serializedATN(): string { return Re_Parser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(Re_Parser._ATN, this);
	}
	// @RuleVersion(0)
	public program(): ProgramContext {
		let _localctx: ProgramContext = new ProgramContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, Re_Parser.RULE_program);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 48;
			this.match(Re_Parser.PROGRAM);
			this.state = 49;
			this.match(Re_Parser.ID);
			this.state = 50;
			this.match(Re_Parser.LBRACE);
			this.state = 55;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.VOID) | (1 << Re_Parser.PRINT) | (1 << Re_Parser.RETURN) | (1 << Re_Parser.VAR) | (1 << Re_Parser.INT_TYPE) | (1 << Re_Parser.DOUBLE_TYPE) | (1 << Re_Parser.LONG_TYPE) | (1 << Re_Parser.SHORT_TYPE) | (1 << Re_Parser.BOOL_TYPE) | (1 << Re_Parser.STRING_TYPE) | (1 << Re_Parser.ARRAY_TYPE) | (1 << Re_Parser.LIST_TYPE) | (1 << Re_Parser.QUEUE) | (1 << Re_Parser.STACK))) !== 0) || ((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & ((1 << (Re_Parser.IF - 53)) | (1 << (Re_Parser.FOR - 53)) | (1 << (Re_Parser.WHILE - 53)) | (1 << (Re_Parser.DO - 53)) | (1 << (Re_Parser.ID - 53)))) !== 0)) {
				{
				this.state = 53;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 0, this._ctx) ) {
				case 1:
					{
					this.state = 51;
					this.sentence();
					}
					break;

				case 2:
					{
					this.state = 52;
					this.function_decl();
					}
					break;
				}
				}
				this.state = 57;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 58;
			this.match(Re_Parser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public function_decl(): Function_declContext {
		let _localctx: Function_declContext = new Function_declContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, Re_Parser.RULE_function_decl);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 62;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case Re_Parser.INT_TYPE:
			case Re_Parser.DOUBLE_TYPE:
			case Re_Parser.LONG_TYPE:
			case Re_Parser.SHORT_TYPE:
			case Re_Parser.BOOL_TYPE:
			case Re_Parser.STRING_TYPE:
			case Re_Parser.ARRAY_TYPE:
			case Re_Parser.LIST_TYPE:
			case Re_Parser.QUEUE:
			case Re_Parser.STACK:
				{
				this.state = 60;
				this.type_specifier();
				}
				break;
			case Re_Parser.VOID:
				{
				this.state = 61;
				this.match(Re_Parser.VOID);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 64;
			this.match(Re_Parser.ID);
			this.state = 65;
			this.match(Re_Parser.LPAREN);
			this.state = 67;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.INT_TYPE) | (1 << Re_Parser.DOUBLE_TYPE) | (1 << Re_Parser.LONG_TYPE) | (1 << Re_Parser.SHORT_TYPE) | (1 << Re_Parser.BOOL_TYPE) | (1 << Re_Parser.STRING_TYPE) | (1 << Re_Parser.ARRAY_TYPE) | (1 << Re_Parser.LIST_TYPE) | (1 << Re_Parser.QUEUE) | (1 << Re_Parser.STACK))) !== 0)) {
				{
				this.state = 66;
				this.param_list();
				}
			}

			this.state = 69;
			this.match(Re_Parser.RPAREN);
			this.state = 70;
			this.match(Re_Parser.LBRACE);
			this.state = 74;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.PRINT) | (1 << Re_Parser.RETURN) | (1 << Re_Parser.VAR) | (1 << Re_Parser.INT_TYPE) | (1 << Re_Parser.DOUBLE_TYPE) | (1 << Re_Parser.LONG_TYPE) | (1 << Re_Parser.SHORT_TYPE) | (1 << Re_Parser.BOOL_TYPE) | (1 << Re_Parser.STRING_TYPE) | (1 << Re_Parser.ARRAY_TYPE) | (1 << Re_Parser.LIST_TYPE) | (1 << Re_Parser.QUEUE) | (1 << Re_Parser.STACK))) !== 0) || ((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & ((1 << (Re_Parser.IF - 53)) | (1 << (Re_Parser.FOR - 53)) | (1 << (Re_Parser.WHILE - 53)) | (1 << (Re_Parser.DO - 53)) | (1 << (Re_Parser.ID - 53)))) !== 0)) {
				{
				{
				this.state = 71;
				this.sentence();
				}
				}
				this.state = 76;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 77;
			this.match(Re_Parser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public param_list(): Param_listContext {
		let _localctx: Param_listContext = new Param_listContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, Re_Parser.RULE_param_list);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 79;
			this.type_specifier();
			this.state = 80;
			this.match(Re_Parser.ID);
			this.state = 87;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === Re_Parser.COMMA) {
				{
				{
				this.state = 81;
				this.match(Re_Parser.COMMA);
				this.state = 82;
				this.type_specifier();
				this.state = 83;
				this.match(Re_Parser.ID);
				}
				}
				this.state = 89;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public sentence(): SentenceContext {
		let _localctx: SentenceContext = new SentenceContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, Re_Parser.RULE_sentence);
		try {
			this.state = 104;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 6, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 90;
				this.var_decl();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 91;
				this.var_assign();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 92;
				this.print_statement();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 93;
				this.if_statement();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 94;
				this.while_statement();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 95;
				this.do_while_statement();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 96;
				this.for_statement();
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 97;
				this.return_statement();
				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 98;
				this.function_call();
				this.state = 99;
				this.match(Re_Parser.SEMI);
				}
				break;

			case 10:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 101;
				this.method_call();
				this.state = 102;
				this.match(Re_Parser.SEMI);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public print_statement(): Print_statementContext {
		let _localctx: Print_statementContext = new Print_statementContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, Re_Parser.RULE_print_statement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 106;
			this.match(Re_Parser.PRINT);
			this.state = 107;
			this.match(Re_Parser.LPAREN);
			this.state = 109;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.INPUT) | (1 << Re_Parser.MINUS) | (1 << Re_Parser.NOT_KW))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (Re_Parser.NOT_OP - 34)) | (1 << (Re_Parser.LPAREN - 34)) | (1 << (Re_Parser.LBRACKET - 34)) | (1 << (Re_Parser.INT - 34)) | (1 << (Re_Parser.DOUBLE - 34)) | (1 << (Re_Parser.STRING - 34)) | (1 << (Re_Parser.BOOL - 34)) | (1 << (Re_Parser.ID - 34)))) !== 0)) {
				{
				this.state = 108;
				this.expression(0);
				}
			}

			this.state = 111;
			this.match(Re_Parser.RPAREN);
			this.state = 112;
			this.match(Re_Parser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public var_decl(): Var_declContext {
		let _localctx: Var_declContext = new Var_declContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, Re_Parser.RULE_var_decl);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 116;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case Re_Parser.INT_TYPE:
			case Re_Parser.DOUBLE_TYPE:
			case Re_Parser.LONG_TYPE:
			case Re_Parser.SHORT_TYPE:
			case Re_Parser.BOOL_TYPE:
			case Re_Parser.STRING_TYPE:
			case Re_Parser.ARRAY_TYPE:
			case Re_Parser.LIST_TYPE:
			case Re_Parser.QUEUE:
			case Re_Parser.STACK:
				{
				this.state = 114;
				this.type_specifier();
				}
				break;
			case Re_Parser.VAR:
				{
				this.state = 115;
				this.match(Re_Parser.VAR);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 118;
			this.match(Re_Parser.ID);
			this.state = 121;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === Re_Parser.ASSIGN) {
				{
				this.state = 119;
				this.match(Re_Parser.ASSIGN);
				this.state = 120;
				this.expression(0);
				}
			}

			this.state = 123;
			this.match(Re_Parser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public var_assign(): Var_assignContext {
		let _localctx: Var_assignContext = new Var_assignContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, Re_Parser.RULE_var_assign);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 125;
			this.match(Re_Parser.ID);
			this.state = 126;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.ASSIGN) | (1 << Re_Parser.PLUS_ASSIGN) | (1 << Re_Parser.MINUS_ASSIGN) | (1 << Re_Parser.MULT_ASSIGN) | (1 << Re_Parser.DIV_ASSIGN))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 127;
			this.expression(0);
			this.state = 128;
			this.match(Re_Parser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public return_statement(): Return_statementContext {
		let _localctx: Return_statementContext = new Return_statementContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, Re_Parser.RULE_return_statement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 130;
			this.match(Re_Parser.RETURN);
			this.state = 132;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.INPUT) | (1 << Re_Parser.MINUS) | (1 << Re_Parser.NOT_KW))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (Re_Parser.NOT_OP - 34)) | (1 << (Re_Parser.LPAREN - 34)) | (1 << (Re_Parser.LBRACKET - 34)) | (1 << (Re_Parser.INT - 34)) | (1 << (Re_Parser.DOUBLE - 34)) | (1 << (Re_Parser.STRING - 34)) | (1 << (Re_Parser.BOOL - 34)) | (1 << (Re_Parser.ID - 34)))) !== 0)) {
				{
				this.state = 131;
				this.expression(0);
				}
			}

			this.state = 134;
			this.match(Re_Parser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public type_specifier(): Type_specifierContext {
		let _localctx: Type_specifierContext = new Type_specifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, Re_Parser.RULE_type_specifier);
		try {
			this.state = 140;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case Re_Parser.INT_TYPE:
			case Re_Parser.DOUBLE_TYPE:
			case Re_Parser.LONG_TYPE:
			case Re_Parser.SHORT_TYPE:
			case Re_Parser.BOOL_TYPE:
			case Re_Parser.STRING_TYPE:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 136;
				this.primitive_type();
				}
				break;
			case Re_Parser.LIST_TYPE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 137;
				this.list_type();
				}
				break;
			case Re_Parser.ARRAY_TYPE:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 138;
				this.array_type();
				}
				break;
			case Re_Parser.QUEUE:
			case Re_Parser.STACK:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 139;
				this.collection_type();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public primitive_type(): Primitive_typeContext {
		let _localctx: Primitive_typeContext = new Primitive_typeContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, Re_Parser.RULE_primitive_type);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 142;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.INT_TYPE) | (1 << Re_Parser.DOUBLE_TYPE) | (1 << Re_Parser.LONG_TYPE) | (1 << Re_Parser.SHORT_TYPE) | (1 << Re_Parser.BOOL_TYPE) | (1 << Re_Parser.STRING_TYPE))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public list_type(): List_typeContext {
		let _localctx: List_typeContext = new List_typeContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, Re_Parser.RULE_list_type);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 144;
			this.match(Re_Parser.LIST_TYPE);
			this.state = 145;
			this.match(Re_Parser.LT);
			this.state = 146;
			this.primitive_type();
			this.state = 147;
			this.match(Re_Parser.GT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public array_type(): Array_typeContext {
		let _localctx: Array_typeContext = new Array_typeContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, Re_Parser.RULE_array_type);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 149;
			this.match(Re_Parser.ARRAY_TYPE);
			this.state = 150;
			this.match(Re_Parser.LT);
			this.state = 151;
			this.primitive_type();
			this.state = 152;
			this.match(Re_Parser.GT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public collection_type(): Collection_typeContext {
		let _localctx: Collection_typeContext = new Collection_typeContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, Re_Parser.RULE_collection_type);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 154;
			_la = this._input.LA(1);
			if (!(_la === Re_Parser.QUEUE || _la === Re_Parser.STACK)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 155;
			this.match(Re_Parser.LT);
			this.state = 156;
			this.primitive_type();
			this.state = 157;
			this.match(Re_Parser.GT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public expression(): ExpressionContext;
	public expression(_p: number): ExpressionContext;
	// @RuleVersion(0)
	public expression(_p?: number): ExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, _parentState);
		let _prevctx: ExpressionContext = _localctx;
		let _startState: number = 26;
		this.enterRecursionRule(_localctx, 26, Re_Parser.RULE_expression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 188;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 14, this._ctx) ) {
			case 1:
				{
				this.state = 160;
				_la = this._input.LA(1);
				if (!(_la === Re_Parser.NOT_KW || _la === Re_Parser.NOT_OP)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 161;
				this.expression(10);
				}
				break;

			case 2:
				{
				this.state = 162;
				this.match(Re_Parser.MINUS);
				this.state = 163;
				this.expression(9);
				}
				break;

			case 3:
				{
				this.state = 164;
				this.match(Re_Parser.LPAREN);
				this.state = 165;
				this.expression(0);
				this.state = 166;
				this.match(Re_Parser.RPAREN);
				}
				break;

			case 4:
				{
				this.state = 168;
				this.literal();
				}
				break;

			case 5:
				{
				this.state = 169;
				this.match(Re_Parser.ID);
				}
				break;

			case 6:
				{
				this.state = 170;
				this.function_call();
				}
				break;

			case 7:
				{
				this.state = 171;
				this.method_call();
				}
				break;

			case 8:
				{
				this.state = 172;
				this.match(Re_Parser.ID);
				this.state = 173;
				this.match(Re_Parser.LBRACKET);
				this.state = 174;
				this.expression(0);
				this.state = 175;
				this.match(Re_Parser.RBRACKET);
				}
				break;

			case 9:
				{
				this.state = 177;
				this.match(Re_Parser.LBRACKET);
				this.state = 179;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.INPUT) | (1 << Re_Parser.MINUS) | (1 << Re_Parser.NOT_KW))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (Re_Parser.NOT_OP - 34)) | (1 << (Re_Parser.LPAREN - 34)) | (1 << (Re_Parser.LBRACKET - 34)) | (1 << (Re_Parser.INT - 34)) | (1 << (Re_Parser.DOUBLE - 34)) | (1 << (Re_Parser.STRING - 34)) | (1 << (Re_Parser.BOOL - 34)) | (1 << (Re_Parser.ID - 34)))) !== 0)) {
					{
					this.state = 178;
					this.list_elements();
					}
				}

				this.state = 181;
				this.match(Re_Parser.RBRACKET);
				}
				break;

			case 10:
				{
				this.state = 182;
				this.match(Re_Parser.INPUT);
				this.state = 183;
				this.match(Re_Parser.LPAREN);
				this.state = 185;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === Re_Parser.STRING) {
					{
					this.state = 184;
					this.match(Re_Parser.STRING);
					}
				}

				this.state = 187;
				this.match(Re_Parser.RPAREN);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 210;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 16, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 208;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
					case 1:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, Re_Parser.RULE_expression);
						this.state = 190;
						if (!(this.precpred(this._ctx, 16))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 16)");
						}
						this.state = 191;
						_la = this._input.LA(1);
						if (!(_la === Re_Parser.OR_KW || _la === Re_Parser.OR_OP)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 192;
						this.expression(17);
						}
						break;

					case 2:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, Re_Parser.RULE_expression);
						this.state = 193;
						if (!(this.precpred(this._ctx, 15))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
						}
						this.state = 194;
						_la = this._input.LA(1);
						if (!(_la === Re_Parser.AND_KW || _la === Re_Parser.AND_OP)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 195;
						this.expression(16);
						}
						break;

					case 3:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, Re_Parser.RULE_expression);
						this.state = 196;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 197;
						_la = this._input.LA(1);
						if (!(((((_la - 36)) & ~0x1F) === 0 && ((1 << (_la - 36)) & ((1 << (Re_Parser.EQ - 36)) | (1 << (Re_Parser.NEQ - 36)) | (1 << (Re_Parser.GTE - 36)) | (1 << (Re_Parser.LTE - 36)) | (1 << (Re_Parser.GT - 36)) | (1 << (Re_Parser.LT - 36)))) !== 0))) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 198;
						this.expression(15);
						}
						break;

					case 4:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, Re_Parser.RULE_expression);
						this.state = 199;
						if (!(this.precpred(this._ctx, 13))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
						}
						this.state = 200;
						_la = this._input.LA(1);
						if (!(_la === Re_Parser.PLUS || _la === Re_Parser.MINUS)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 201;
						this.expression(14);
						}
						break;

					case 5:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, Re_Parser.RULE_expression);
						this.state = 202;
						if (!(this.precpred(this._ctx, 12))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
						}
						this.state = 203;
						_la = this._input.LA(1);
						if (!(_la === Re_Parser.MULT || _la === Re_Parser.DIV)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 204;
						this.expression(13);
						}
						break;

					case 6:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, Re_Parser.RULE_expression);
						this.state = 205;
						if (!(this.precpred(this._ctx, 11))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 11)");
						}
						this.state = 206;
						this.match(Re_Parser.EXP);
						this.state = 207;
						this.expression(11);
						}
						break;
					}
					}
				}
				this.state = 212;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 16, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public function_call(): Function_callContext {
		let _localctx: Function_callContext = new Function_callContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, Re_Parser.RULE_function_call);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 213;
			this.match(Re_Parser.ID);
			this.state = 214;
			this.match(Re_Parser.LPAREN);
			this.state = 216;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.INPUT) | (1 << Re_Parser.MINUS) | (1 << Re_Parser.NOT_KW))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (Re_Parser.NOT_OP - 34)) | (1 << (Re_Parser.LPAREN - 34)) | (1 << (Re_Parser.LBRACKET - 34)) | (1 << (Re_Parser.INT - 34)) | (1 << (Re_Parser.DOUBLE - 34)) | (1 << (Re_Parser.STRING - 34)) | (1 << (Re_Parser.BOOL - 34)) | (1 << (Re_Parser.ID - 34)))) !== 0)) {
				{
				this.state = 215;
				this.argument_list();
				}
			}

			this.state = 218;
			this.match(Re_Parser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public method_call(): Method_callContext {
		let _localctx: Method_callContext = new Method_callContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, Re_Parser.RULE_method_call);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 220;
			this.match(Re_Parser.ID);
			this.state = 221;
			this.match(Re_Parser.DOT);
			this.state = 222;
			this.match(Re_Parser.ID);
			this.state = 223;
			this.match(Re_Parser.LPAREN);
			this.state = 225;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.INPUT) | (1 << Re_Parser.MINUS) | (1 << Re_Parser.NOT_KW))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (Re_Parser.NOT_OP - 34)) | (1 << (Re_Parser.LPAREN - 34)) | (1 << (Re_Parser.LBRACKET - 34)) | (1 << (Re_Parser.INT - 34)) | (1 << (Re_Parser.DOUBLE - 34)) | (1 << (Re_Parser.STRING - 34)) | (1 << (Re_Parser.BOOL - 34)) | (1 << (Re_Parser.ID - 34)))) !== 0)) {
				{
				this.state = 224;
				this.argument_list();
				}
			}

			this.state = 227;
			this.match(Re_Parser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public argument_list(): Argument_listContext {
		let _localctx: Argument_listContext = new Argument_listContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, Re_Parser.RULE_argument_list);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 229;
			this.expression(0);
			this.state = 234;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === Re_Parser.COMMA) {
				{
				{
				this.state = 230;
				this.match(Re_Parser.COMMA);
				this.state = 231;
				this.expression(0);
				}
				}
				this.state = 236;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public literal(): LiteralContext {
		let _localctx: LiteralContext = new LiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, Re_Parser.RULE_literal);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 237;
			_la = this._input.LA(1);
			if (!(((((_la - 58)) & ~0x1F) === 0 && ((1 << (_la - 58)) & ((1 << (Re_Parser.INT - 58)) | (1 << (Re_Parser.DOUBLE - 58)) | (1 << (Re_Parser.STRING - 58)) | (1 << (Re_Parser.BOOL - 58)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public if_statement(): If_statementContext {
		let _localctx: If_statementContext = new If_statementContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, Re_Parser.RULE_if_statement);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 239;
			this.match(Re_Parser.IF);
			this.state = 240;
			this.match(Re_Parser.LPAREN);
			this.state = 241;
			this.expression(0);
			this.state = 242;
			this.match(Re_Parser.RPAREN);
			this.state = 243;
			this.match(Re_Parser.LBRACE);
			this.state = 247;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.PRINT) | (1 << Re_Parser.RETURN) | (1 << Re_Parser.VAR) | (1 << Re_Parser.INT_TYPE) | (1 << Re_Parser.DOUBLE_TYPE) | (1 << Re_Parser.LONG_TYPE) | (1 << Re_Parser.SHORT_TYPE) | (1 << Re_Parser.BOOL_TYPE) | (1 << Re_Parser.STRING_TYPE) | (1 << Re_Parser.ARRAY_TYPE) | (1 << Re_Parser.LIST_TYPE) | (1 << Re_Parser.QUEUE) | (1 << Re_Parser.STACK))) !== 0) || ((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & ((1 << (Re_Parser.IF - 53)) | (1 << (Re_Parser.FOR - 53)) | (1 << (Re_Parser.WHILE - 53)) | (1 << (Re_Parser.DO - 53)) | (1 << (Re_Parser.ID - 53)))) !== 0)) {
				{
				{
				this.state = 244;
				this.sentence();
				}
				}
				this.state = 249;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 250;
			this.match(Re_Parser.RBRACE);
			this.state = 267;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 22, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 251;
					this.match(Re_Parser.ELSE);
					this.state = 252;
					this.match(Re_Parser.IF);
					this.state = 253;
					this.match(Re_Parser.LPAREN);
					this.state = 254;
					this.expression(0);
					this.state = 255;
					this.match(Re_Parser.RPAREN);
					this.state = 256;
					this.match(Re_Parser.LBRACE);
					this.state = 260;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.PRINT) | (1 << Re_Parser.RETURN) | (1 << Re_Parser.VAR) | (1 << Re_Parser.INT_TYPE) | (1 << Re_Parser.DOUBLE_TYPE) | (1 << Re_Parser.LONG_TYPE) | (1 << Re_Parser.SHORT_TYPE) | (1 << Re_Parser.BOOL_TYPE) | (1 << Re_Parser.STRING_TYPE) | (1 << Re_Parser.ARRAY_TYPE) | (1 << Re_Parser.LIST_TYPE) | (1 << Re_Parser.QUEUE) | (1 << Re_Parser.STACK))) !== 0) || ((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & ((1 << (Re_Parser.IF - 53)) | (1 << (Re_Parser.FOR - 53)) | (1 << (Re_Parser.WHILE - 53)) | (1 << (Re_Parser.DO - 53)) | (1 << (Re_Parser.ID - 53)))) !== 0)) {
						{
						{
						this.state = 257;
						this.sentence();
						}
						}
						this.state = 262;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					this.state = 263;
					this.match(Re_Parser.RBRACE);
					}
					}
				}
				this.state = 269;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 22, this._ctx);
			}
			this.state = 279;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === Re_Parser.ELSE) {
				{
				this.state = 270;
				this.match(Re_Parser.ELSE);
				this.state = 271;
				this.match(Re_Parser.LBRACE);
				this.state = 275;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.PRINT) | (1 << Re_Parser.RETURN) | (1 << Re_Parser.VAR) | (1 << Re_Parser.INT_TYPE) | (1 << Re_Parser.DOUBLE_TYPE) | (1 << Re_Parser.LONG_TYPE) | (1 << Re_Parser.SHORT_TYPE) | (1 << Re_Parser.BOOL_TYPE) | (1 << Re_Parser.STRING_TYPE) | (1 << Re_Parser.ARRAY_TYPE) | (1 << Re_Parser.LIST_TYPE) | (1 << Re_Parser.QUEUE) | (1 << Re_Parser.STACK))) !== 0) || ((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & ((1 << (Re_Parser.IF - 53)) | (1 << (Re_Parser.FOR - 53)) | (1 << (Re_Parser.WHILE - 53)) | (1 << (Re_Parser.DO - 53)) | (1 << (Re_Parser.ID - 53)))) !== 0)) {
					{
					{
					this.state = 272;
					this.sentence();
					}
					}
					this.state = 277;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 278;
				this.match(Re_Parser.RBRACE);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public while_statement(): While_statementContext {
		let _localctx: While_statementContext = new While_statementContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, Re_Parser.RULE_while_statement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 281;
			this.match(Re_Parser.WHILE);
			this.state = 282;
			this.match(Re_Parser.LPAREN);
			this.state = 283;
			this.expression(0);
			this.state = 284;
			this.match(Re_Parser.RPAREN);
			this.state = 294;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case Re_Parser.LBRACE:
				{
				this.state = 285;
				this.match(Re_Parser.LBRACE);
				this.state = 289;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.PRINT) | (1 << Re_Parser.RETURN) | (1 << Re_Parser.VAR) | (1 << Re_Parser.INT_TYPE) | (1 << Re_Parser.DOUBLE_TYPE) | (1 << Re_Parser.LONG_TYPE) | (1 << Re_Parser.SHORT_TYPE) | (1 << Re_Parser.BOOL_TYPE) | (1 << Re_Parser.STRING_TYPE) | (1 << Re_Parser.ARRAY_TYPE) | (1 << Re_Parser.LIST_TYPE) | (1 << Re_Parser.QUEUE) | (1 << Re_Parser.STACK))) !== 0) || ((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & ((1 << (Re_Parser.IF - 53)) | (1 << (Re_Parser.FOR - 53)) | (1 << (Re_Parser.WHILE - 53)) | (1 << (Re_Parser.DO - 53)) | (1 << (Re_Parser.ID - 53)))) !== 0)) {
					{
					{
					this.state = 286;
					this.sentence();
					}
					}
					this.state = 291;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 292;
				this.match(Re_Parser.RBRACE);
				}
				break;
			case Re_Parser.PRINT:
			case Re_Parser.RETURN:
			case Re_Parser.VAR:
			case Re_Parser.INT_TYPE:
			case Re_Parser.DOUBLE_TYPE:
			case Re_Parser.LONG_TYPE:
			case Re_Parser.SHORT_TYPE:
			case Re_Parser.BOOL_TYPE:
			case Re_Parser.STRING_TYPE:
			case Re_Parser.ARRAY_TYPE:
			case Re_Parser.LIST_TYPE:
			case Re_Parser.QUEUE:
			case Re_Parser.STACK:
			case Re_Parser.IF:
			case Re_Parser.FOR:
			case Re_Parser.WHILE:
			case Re_Parser.DO:
			case Re_Parser.ID:
				{
				this.state = 293;
				this.sentence();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public do_while_statement(): Do_while_statementContext {
		let _localctx: Do_while_statementContext = new Do_while_statementContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, Re_Parser.RULE_do_while_statement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 296;
			this.match(Re_Parser.DO);
			this.state = 297;
			this.match(Re_Parser.LBRACE);
			this.state = 301;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.PRINT) | (1 << Re_Parser.RETURN) | (1 << Re_Parser.VAR) | (1 << Re_Parser.INT_TYPE) | (1 << Re_Parser.DOUBLE_TYPE) | (1 << Re_Parser.LONG_TYPE) | (1 << Re_Parser.SHORT_TYPE) | (1 << Re_Parser.BOOL_TYPE) | (1 << Re_Parser.STRING_TYPE) | (1 << Re_Parser.ARRAY_TYPE) | (1 << Re_Parser.LIST_TYPE) | (1 << Re_Parser.QUEUE) | (1 << Re_Parser.STACK))) !== 0) || ((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & ((1 << (Re_Parser.IF - 53)) | (1 << (Re_Parser.FOR - 53)) | (1 << (Re_Parser.WHILE - 53)) | (1 << (Re_Parser.DO - 53)) | (1 << (Re_Parser.ID - 53)))) !== 0)) {
				{
				{
				this.state = 298;
				this.sentence();
				}
				}
				this.state = 303;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 304;
			this.match(Re_Parser.RBRACE);
			this.state = 305;
			this.match(Re_Parser.WHILE);
			this.state = 306;
			this.match(Re_Parser.LPAREN);
			this.state = 307;
			this.expression(0);
			this.state = 308;
			this.match(Re_Parser.RPAREN);
			this.state = 309;
			this.match(Re_Parser.SEMI);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public for_statement(): For_statementContext {
		let _localctx: For_statementContext = new For_statementContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, Re_Parser.RULE_for_statement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 311;
			this.match(Re_Parser.FOR);
			this.state = 312;
			this.match(Re_Parser.ID);
			this.state = 313;
			this.match(Re_Parser.IN);
			this.state = 314;
			this.for_expression();
			this.state = 324;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case Re_Parser.LBRACE:
				{
				this.state = 315;
				this.match(Re_Parser.LBRACE);
				this.state = 319;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.PRINT) | (1 << Re_Parser.RETURN) | (1 << Re_Parser.VAR) | (1 << Re_Parser.INT_TYPE) | (1 << Re_Parser.DOUBLE_TYPE) | (1 << Re_Parser.LONG_TYPE) | (1 << Re_Parser.SHORT_TYPE) | (1 << Re_Parser.BOOL_TYPE) | (1 << Re_Parser.STRING_TYPE) | (1 << Re_Parser.ARRAY_TYPE) | (1 << Re_Parser.LIST_TYPE) | (1 << Re_Parser.QUEUE) | (1 << Re_Parser.STACK))) !== 0) || ((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & ((1 << (Re_Parser.IF - 53)) | (1 << (Re_Parser.FOR - 53)) | (1 << (Re_Parser.WHILE - 53)) | (1 << (Re_Parser.DO - 53)) | (1 << (Re_Parser.ID - 53)))) !== 0)) {
					{
					{
					this.state = 316;
					this.sentence();
					}
					}
					this.state = 321;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 322;
				this.match(Re_Parser.RBRACE);
				}
				break;
			case Re_Parser.PRINT:
			case Re_Parser.RETURN:
			case Re_Parser.VAR:
			case Re_Parser.INT_TYPE:
			case Re_Parser.DOUBLE_TYPE:
			case Re_Parser.LONG_TYPE:
			case Re_Parser.SHORT_TYPE:
			case Re_Parser.BOOL_TYPE:
			case Re_Parser.STRING_TYPE:
			case Re_Parser.ARRAY_TYPE:
			case Re_Parser.LIST_TYPE:
			case Re_Parser.QUEUE:
			case Re_Parser.STACK:
			case Re_Parser.IF:
			case Re_Parser.FOR:
			case Re_Parser.WHILE:
			case Re_Parser.DO:
			case Re_Parser.ID:
				{
				this.state = 323;
				this.sentence();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public for_expression(): For_expressionContext {
		let _localctx: For_expressionContext = new For_expressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, Re_Parser.RULE_for_expression);
		let _la: number;
		try {
			this.state = 336;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 31, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 326;
				this.expression(0);
				this.state = 327;
				this.match(Re_Parser.DOTDOT);
				this.state = 328;
				this.expression(0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 330;
				this.match(Re_Parser.LBRACKET);
				this.state = 332;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Re_Parser.INPUT) | (1 << Re_Parser.MINUS) | (1 << Re_Parser.NOT_KW))) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (Re_Parser.NOT_OP - 34)) | (1 << (Re_Parser.LPAREN - 34)) | (1 << (Re_Parser.LBRACKET - 34)) | (1 << (Re_Parser.INT - 34)) | (1 << (Re_Parser.DOUBLE - 34)) | (1 << (Re_Parser.STRING - 34)) | (1 << (Re_Parser.BOOL - 34)) | (1 << (Re_Parser.ID - 34)))) !== 0)) {
					{
					this.state = 331;
					this.list_elements();
					}
				}

				this.state = 334;
				this.match(Re_Parser.RBRACKET);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 335;
				this.match(Re_Parser.ID);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public list_elements(): List_elementsContext {
		let _localctx: List_elementsContext = new List_elementsContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, Re_Parser.RULE_list_elements);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 338;
			this.expression(0);
			this.state = 343;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === Re_Parser.COMMA) {
				{
				{
				this.state = 339;
				this.match(Re_Parser.COMMA);
				this.state = 340;
				this.expression(0);
				}
				}
				this.state = 345;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 13:
			return this.expression_sempred(_localctx as ExpressionContext, predIndex);
		}
		return true;
	}
	private expression_sempred(_localctx: ExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 16);

		case 1:
			return this.precpred(this._ctx, 15);

		case 2:
			return this.precpred(this._ctx, 14);

		case 3:
			return this.precpred(this._ctx, 13);

		case 4:
			return this.precpred(this._ctx, 12);

		case 5:
			return this.precpred(this._ctx, 11);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03C\u015D\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04" +
		"\x18\t\x18\x04\x19\t\x19\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x07\x02" +
		"8\n\x02\f\x02\x0E\x02;\v\x02\x03\x02\x03\x02\x03\x03\x03\x03\x05\x03A" +
		"\n\x03\x03\x03\x03\x03\x03\x03\x05\x03F\n\x03\x03\x03\x03\x03\x03\x03" +
		"\x07\x03K\n\x03\f\x03\x0E\x03N\v\x03\x03\x03\x03\x03\x03\x04\x03\x04\x03" +
		"\x04\x03\x04\x03\x04\x03\x04\x07\x04X\n\x04\f\x04\x0E\x04[\v\x04\x03\x05" +
		"\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05" +
		"\x03\x05\x03\x05\x03\x05\x03\x05\x05\x05k\n\x05\x03\x06\x03\x06\x03\x06" +
		"\x05\x06p\n\x06\x03\x06\x03\x06\x03\x06\x03\x07\x03\x07\x05\x07w\n\x07" +
		"\x03\x07\x03\x07\x03\x07\x05\x07|\n\x07\x03\x07\x03\x07\x03\b\x03\b\x03" +
		"\b\x03\b\x03\b\x03\t\x03\t\x05\t\x87\n\t\x03\t\x03\t\x03\n\x03\n\x03\n" +
		"\x03\n\x05\n\x8F\n\n\x03\v\x03\v\x03\f\x03\f\x03\f\x03\f\x03\f\x03\r\x03" +
		"\r\x03\r\x03\r\x03\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0F\x03" +
		"\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03" +
		"\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03" +
		"\x0F\x05\x0F\xB6\n\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x05\x0F\xBC\n\x0F" +
		"\x03\x0F\x05\x0F\xBF\n\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03" +
		"\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03" +
		"\x0F\x03\x0F\x03\x0F\x03\x0F\x07\x0F\xD3\n\x0F\f\x0F\x0E\x0F\xD6\v\x0F" +
		"\x03\x10\x03\x10\x03\x10\x05\x10\xDB\n\x10\x03\x10\x03\x10\x03\x11\x03" +
		"\x11\x03\x11\x03\x11\x03\x11\x05\x11\xE4\n\x11\x03\x11\x03\x11\x03\x12" +
		"\x03\x12\x03\x12\x07\x12\xEB\n\x12\f\x12\x0E\x12\xEE\v\x12\x03\x13\x03" +
		"\x13\x03\x14\x03\x14\x03\x14\x03\x14\x03\x14\x03\x14\x07\x14\xF8\n\x14" +
		"\f\x14\x0E\x14\xFB\v\x14\x03\x14\x03\x14\x03\x14\x03\x14\x03\x14\x03\x14" +
		"\x03\x14\x03\x14\x07\x14\u0105\n\x14\f\x14\x0E\x14\u0108\v\x14\x03\x14" +
		"\x03\x14\x07\x14\u010C\n\x14\f\x14\x0E\x14\u010F\v\x14\x03\x14\x03\x14" +
		"\x03\x14\x07\x14\u0114\n\x14\f\x14\x0E\x14\u0117\v\x14\x03\x14\x05\x14" +
		"\u011A\n\x14\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x07\x15\u0122" +
		"\n\x15\f\x15\x0E\x15\u0125\v\x15\x03\x15\x03\x15\x05\x15\u0129\n\x15\x03" +
		"\x16\x03\x16\x03\x16\x07\x16\u012E\n\x16\f\x16\x0E\x16\u0131\v\x16\x03" +
		"\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x17\x03\x17\x03" +
		"\x17\x03\x17\x03\x17\x03\x17\x07\x17\u0140\n\x17\f\x17\x0E\x17\u0143\v" +
		"\x17\x03\x17\x03\x17\x05\x17\u0147\n\x17\x03\x18\x03\x18\x03\x18\x03\x18" +
		"\x03\x18\x03\x18\x05\x18\u014F\n\x18\x03\x18\x03\x18\x05\x18\u0153\n\x18" +
		"\x03\x19\x03\x19\x03\x19\x07\x19\u0158\n\x19\f\x19\x0E\x19\u015B\v\x19" +
		"\x03\x19\x02\x02\x03\x1C\x1A\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02" +
		"\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02" +
		" \x02\"\x02$\x02&\x02(\x02*\x02,\x02.\x020\x02\x02\f\x03\x02\x1A\x1E\x03" +
		"\x02\v\x10\x03\x02\x13\x14\x04\x02!!$$\x04\x02  ##\x04\x02\x1F\x1F\"\"" +
		"\x03\x02&+\x03\x02\x15\x16\x03\x02\x17\x18\x03\x02<?\x02\u017C\x022\x03" +
		"\x02\x02\x02\x04@\x03\x02\x02\x02\x06Q\x03\x02\x02\x02\bj\x03\x02\x02" +
		"\x02\nl\x03\x02\x02\x02\fv\x03\x02\x02\x02\x0E\x7F\x03\x02\x02\x02\x10" +
		"\x84\x03\x02\x02\x02\x12\x8E\x03\x02\x02\x02\x14\x90\x03\x02\x02\x02\x16" +
		"\x92\x03\x02\x02\x02\x18\x97\x03\x02\x02\x02\x1A\x9C\x03\x02\x02\x02\x1C" +
		"\xBE\x03\x02\x02\x02\x1E\xD7\x03\x02\x02\x02 \xDE\x03\x02\x02\x02\"\xE7" +
		"\x03\x02\x02\x02$\xEF\x03\x02\x02\x02&\xF1\x03\x02\x02\x02(\u011B\x03" +
		"\x02\x02\x02*\u012A\x03\x02\x02\x02,\u0139\x03\x02\x02\x02.\u0152\x03" +
		"\x02\x02\x020\u0154\x03\x02\x02\x0223\x07\x03\x02\x0234\x07@\x02\x024" +
		"9\x073\x02\x0258\x05\b\x05\x0268\x05\x04\x03\x0275\x03\x02\x02\x0276\x03" +
		"\x02\x02\x028;\x03\x02\x02\x0297\x03\x02\x02\x029:\x03\x02\x02\x02:<\x03" +
		"\x02\x02\x02;9\x03\x02\x02\x02<=\x074\x02\x02=\x03\x03\x02\x02\x02>A\x05" +
		"\x12\n\x02?A\x07\x05\x02\x02@>\x03\x02\x02\x02@?\x03\x02\x02\x02AB\x03" +
		"\x02\x02\x02BC\x07@\x02\x02CE\x071\x02\x02DF\x05\x06\x04\x02ED\x03\x02" +
		"\x02\x02EF\x03\x02\x02\x02FG\x03\x02\x02\x02GH\x072\x02\x02HL\x073\x02" +
		"\x02IK\x05\b\x05\x02JI\x03\x02\x02\x02KN\x03\x02\x02\x02LJ\x03\x02\x02" +
		"\x02LM\x03\x02\x02\x02MO\x03\x02\x02\x02NL\x03\x02\x02\x02OP\x074\x02" +
		"\x02P\x05\x03\x02\x02\x02QR\x05\x12\n\x02RY\x07@\x02\x02ST\x070\x02\x02" +
		"TU\x05\x12\n\x02UV\x07@\x02\x02VX\x03\x02\x02\x02WS\x03\x02\x02\x02X[" +
		"\x03\x02\x02\x02YW\x03\x02\x02\x02YZ\x03\x02\x02\x02Z\x07\x03\x02\x02" +
		"\x02[Y\x03\x02\x02\x02\\k\x05\f\x07\x02]k\x05\x0E\b\x02^k\x05\n\x06\x02" +
		"_k\x05&\x14\x02`k\x05(\x15\x02ak\x05*\x16\x02bk\x05,\x17\x02ck\x05\x10" +
		"\t\x02de\x05\x1E\x10\x02ef\x07/\x02\x02fk\x03\x02\x02\x02gh\x05 \x11\x02" +
		"hi\x07/\x02\x02ik\x03\x02\x02\x02j\\\x03\x02\x02\x02j]\x03\x02\x02\x02" +
		"j^\x03\x02\x02\x02j_\x03\x02\x02\x02j`\x03\x02\x02\x02ja\x03\x02\x02\x02" +
		"jb\x03\x02\x02\x02jc\x03\x02\x02\x02jd\x03\x02\x02\x02jg\x03\x02\x02\x02" +
		"k\t\x03\x02\x02\x02lm\x07\x06\x02\x02mo\x071\x02\x02np\x05\x1C\x0F\x02" +
		"on\x03\x02\x02\x02op\x03\x02\x02\x02pq\x03\x02\x02\x02qr\x072\x02\x02" +
		"rs\x07/\x02\x02s\v\x03\x02\x02\x02tw\x05\x12\n\x02uw\x07\n\x02\x02vt\x03" +
		"\x02\x02\x02vu\x03\x02\x02\x02wx\x03\x02\x02\x02x{\x07@\x02\x02yz\x07" +
		"\x1A\x02\x02z|\x05\x1C\x0F\x02{y\x03\x02\x02\x02{|\x03\x02\x02\x02|}\x03" +
		"\x02\x02\x02}~\x07/\x02\x02~\r\x03\x02\x02\x02\x7F\x80\x07@\x02\x02\x80" +
		"\x81\t\x02\x02\x02\x81\x82\x05\x1C\x0F\x02\x82\x83\x07/\x02\x02\x83\x0F" +
		"\x03\x02\x02\x02\x84\x86\x07\b\x02\x02\x85\x87\x05\x1C\x0F\x02\x86\x85" +
		"\x03\x02\x02\x02\x86\x87\x03\x02\x02\x02\x87\x88\x03\x02\x02\x02\x88\x89" +
		"\x07/\x02\x02\x89\x11\x03\x02\x02\x02\x8A\x8F\x05\x14\v\x02\x8B\x8F\x05" +
		"\x16\f\x02\x8C\x8F\x05\x18\r\x02\x8D\x8F\x05\x1A\x0E\x02\x8E\x8A\x03\x02" +
		"\x02\x02\x8E\x8B\x03\x02\x02\x02\x8E\x8C\x03\x02\x02\x02\x8E\x8D\x03\x02" +
		"\x02\x02\x8F\x13\x03\x02\x02\x02\x90\x91\t\x03\x02\x02\x91\x15\x03\x02" +
		"\x02\x02\x92\x93\x07\x12\x02\x02\x93\x94\x07+\x02\x02\x94\x95\x05\x14" +
		"\v\x02\x95\x96\x07*\x02\x02\x96\x17\x03\x02\x02\x02\x97\x98\x07\x11\x02" +
		"\x02\x98\x99\x07+\x02\x02\x99\x9A\x05\x14\v\x02\x9A\x9B\x07*\x02\x02\x9B" +
		"\x19\x03\x02\x02\x02\x9C\x9D\t\x04\x02\x02\x9D\x9E\x07+\x02\x02\x9E\x9F" +
		"\x05\x14\v\x02\x9F\xA0\x07*\x02\x02\xA0\x1B\x03\x02\x02\x02\xA1\xA2\b" +
		"\x0F\x01\x02\xA2\xA3\t\x05\x02\x02\xA3\xBF\x05\x1C\x0F\f\xA4\xA5\x07\x16" +
		"\x02\x02\xA5\xBF\x05\x1C\x0F\v\xA6\xA7\x071\x02\x02\xA7\xA8\x05\x1C\x0F" +
		"\x02\xA8\xA9\x072\x02\x02\xA9\xBF\x03\x02\x02\x02\xAA\xBF\x05$\x13\x02" +
		"\xAB\xBF\x07@\x02\x02\xAC\xBF\x05\x1E\x10\x02\xAD\xBF\x05 \x11\x02\xAE" +
		"\xAF\x07@\x02\x02\xAF\xB0\x075\x02\x02\xB0\xB1\x05\x1C\x0F\x02\xB1\xB2" +
		"\x076\x02\x02\xB2\xBF\x03\x02\x02\x02\xB3\xB5\x075\x02\x02\xB4\xB6\x05" +
		"0\x19\x02\xB5\xB4\x03\x02\x02\x02\xB5\xB6\x03\x02\x02\x02\xB6\xB7\x03" +
		"\x02\x02\x02\xB7\xBF\x076\x02\x02\xB8\xB9\x07\x07\x02\x02\xB9\xBB\x07" +
		"1\x02\x02\xBA\xBC\x07>\x02\x02\xBB\xBA\x03\x02\x02\x02\xBB\xBC\x03\x02" +
		"\x02\x02\xBC\xBD\x03\x02\x02\x02\xBD\xBF\x072\x02\x02\xBE\xA1\x03\x02" +
		"\x02\x02\xBE\xA4\x03\x02\x02\x02\xBE\xA6\x03\x02\x02\x02\xBE\xAA\x03\x02" +
		"\x02\x02\xBE\xAB\x03\x02\x02\x02\xBE\xAC\x03\x02\x02\x02\xBE\xAD\x03\x02" +
		"\x02\x02\xBE\xAE\x03\x02\x02\x02\xBE\xB3\x03\x02\x02\x02\xBE\xB8\x03\x02" +
		"\x02\x02\xBF\xD4\x03\x02\x02\x02\xC0\xC1\f\x12\x02\x02\xC1\xC2\t\x06\x02" +
		"\x02\xC2\xD3\x05\x1C\x0F\x13\xC3\xC4\f\x11\x02\x02\xC4\xC5\t\x07\x02\x02" +
		"\xC5\xD3\x05\x1C\x0F\x12\xC6\xC7\f\x10\x02\x02\xC7\xC8\t\b\x02\x02\xC8" +
		"\xD3\x05\x1C\x0F\x11\xC9\xCA\f\x0F\x02\x02\xCA\xCB\t\t\x02\x02\xCB\xD3" +
		"\x05\x1C\x0F\x10\xCC\xCD\f\x0E\x02\x02\xCD\xCE\t\n\x02\x02\xCE\xD3\x05" +
		"\x1C\x0F\x0F\xCF\xD0\f\r\x02\x02\xD0\xD1\x07\x19\x02\x02\xD1\xD3\x05\x1C" +
		"\x0F\r\xD2\xC0\x03\x02\x02\x02\xD2\xC3\x03\x02\x02\x02\xD2\xC6\x03\x02" +
		"\x02\x02\xD2\xC9\x03\x02\x02\x02\xD2\xCC\x03\x02\x02\x02\xD2\xCF\x03\x02" +
		"\x02\x02\xD3\xD6\x03\x02\x02\x02\xD4\xD2\x03\x02\x02\x02\xD4\xD5\x03\x02" +
		"\x02\x02\xD5\x1D\x03\x02\x02\x02\xD6\xD4\x03\x02\x02\x02\xD7\xD8\x07@" +
		"\x02\x02\xD8\xDA\x071\x02\x02\xD9\xDB\x05\"\x12\x02\xDA\xD9\x03\x02\x02" +
		"\x02\xDA\xDB\x03\x02\x02\x02\xDB\xDC\x03\x02\x02\x02\xDC\xDD\x072\x02" +
		"\x02\xDD\x1F\x03\x02\x02\x02\xDE\xDF\x07@\x02\x02\xDF\xE0\x07-\x02\x02" +
		"\xE0\xE1\x07@\x02\x02\xE1\xE3\x071\x02\x02\xE2\xE4\x05\"\x12\x02\xE3\xE2" +
		"\x03\x02\x02\x02\xE3\xE4\x03\x02\x02\x02\xE4\xE5\x03\x02\x02\x02\xE5\xE6" +
		"\x072\x02\x02\xE6!\x03\x02\x02\x02\xE7\xEC\x05\x1C\x0F\x02\xE8\xE9\x07" +
		"0\x02\x02\xE9\xEB\x05\x1C\x0F\x02\xEA\xE8\x03\x02\x02\x02\xEB\xEE\x03" +
		"\x02\x02\x02\xEC\xEA\x03\x02\x02\x02\xEC\xED\x03\x02\x02\x02\xED#\x03" +
		"\x02\x02\x02\xEE\xEC\x03\x02\x02\x02\xEF\xF0\t\v\x02\x02\xF0%\x03\x02" +
		"\x02\x02\xF1\xF2\x077\x02\x02\xF2\xF3\x071\x02\x02\xF3\xF4\x05\x1C\x0F" +
		"\x02\xF4\xF5\x072\x02\x02\xF5\xF9\x073\x02\x02\xF6\xF8\x05\b\x05\x02\xF7" +
		"\xF6\x03\x02\x02\x02\xF8\xFB\x03\x02\x02\x02\xF9\xF7\x03\x02\x02\x02\xF9" +
		"\xFA\x03\x02\x02\x02\xFA\xFC\x03\x02\x02\x02\xFB\xF9\x03\x02\x02\x02\xFC" +
		"\u010D\x074\x02\x02\xFD\xFE\x078\x02\x02\xFE\xFF\x077\x02\x02\xFF\u0100" +
		"\x071\x02\x02\u0100\u0101\x05\x1C\x0F\x02\u0101\u0102\x072\x02\x02\u0102" +
		"\u0106\x073\x02\x02\u0103\u0105\x05\b\x05\x02\u0104\u0103\x03\x02\x02" +
		"\x02\u0105\u0108\x03\x02\x02\x02\u0106\u0104\x03\x02\x02\x02\u0106\u0107" +
		"\x03\x02\x02\x02\u0107\u0109\x03\x02\x02\x02\u0108\u0106\x03\x02\x02\x02" +
		"\u0109\u010A\x074\x02\x02\u010A\u010C\x03\x02\x02\x02\u010B\xFD\x03\x02" +
		"\x02\x02\u010C\u010F\x03\x02\x02\x02\u010D\u010B\x03\x02\x02\x02\u010D" +
		"\u010E\x03\x02\x02\x02\u010E\u0119\x03\x02\x02\x02\u010F\u010D\x03\x02" +
		"\x02\x02\u0110\u0111\x078\x02\x02\u0111\u0115\x073\x02\x02\u0112\u0114" +
		"\x05\b\x05\x02\u0113\u0112\x03\x02\x02\x02\u0114\u0117\x03\x02\x02\x02" +
		"\u0115\u0113\x03\x02\x02\x02\u0115\u0116\x03\x02\x02\x02\u0116\u0118\x03" +
		"\x02\x02\x02\u0117\u0115\x03\x02\x02\x02\u0118\u011A\x074\x02\x02\u0119" +
		"\u0110\x03\x02\x02\x02\u0119\u011A\x03\x02\x02\x02\u011A\'\x03\x02\x02" +
		"\x02\u011B\u011C\x07:\x02\x02\u011C\u011D\x071\x02\x02\u011D\u011E\x05" +
		"\x1C\x0F\x02\u011E\u0128\x072\x02\x02\u011F\u0123\x073\x02\x02\u0120\u0122" +
		"\x05\b\x05\x02\u0121\u0120\x03\x02\x02\x02\u0122\u0125\x03\x02\x02\x02" +
		"\u0123\u0121\x03\x02\x02\x02\u0123\u0124\x03\x02\x02\x02\u0124\u0126\x03" +
		"\x02\x02\x02\u0125\u0123\x03\x02\x02\x02\u0126\u0129\x074\x02\x02\u0127" +
		"\u0129\x05\b\x05\x02\u0128\u011F\x03\x02\x02\x02\u0128\u0127\x03\x02\x02" +
		"\x02\u0129)\x03\x02\x02\x02\u012A\u012B\x07;\x02\x02\u012B\u012F\x073" +
		"\x02\x02\u012C\u012E\x05\b\x05\x02\u012D\u012C\x03\x02\x02\x02\u012E\u0131" +
		"\x03\x02\x02\x02\u012F\u012D\x03\x02\x02\x02\u012F\u0130\x03\x02\x02\x02" +
		"\u0130\u0132\x03\x02\x02\x02\u0131\u012F\x03\x02\x02\x02\u0132\u0133\x07" +
		"4\x02\x02\u0133\u0134\x07:\x02\x02\u0134\u0135\x071\x02\x02\u0135\u0136" +
		"\x05\x1C\x0F\x02\u0136\u0137\x072\x02\x02\u0137\u0138\x07/\x02\x02\u0138" +
		"+\x03\x02\x02\x02\u0139\u013A\x079\x02\x02\u013A\u013B\x07@\x02\x02\u013B" +
		"\u013C\x07%\x02\x02\u013C\u0146\x05.\x18\x02\u013D\u0141\x073\x02\x02" +
		"\u013E\u0140\x05\b\x05\x02\u013F\u013E\x03\x02\x02\x02\u0140\u0143\x03" +
		"\x02\x02\x02\u0141\u013F\x03\x02\x02\x02\u0141\u0142\x03\x02\x02\x02\u0142" +
		"\u0144\x03\x02\x02\x02\u0143\u0141\x03\x02\x02\x02\u0144\u0147\x074\x02" +
		"\x02\u0145\u0147\x05\b\x05\x02\u0146\u013D\x03\x02\x02\x02\u0146\u0145" +
		"\x03\x02\x02\x02\u0147-\x03\x02\x02\x02\u0148\u0149\x05\x1C\x0F\x02\u0149" +
		"\u014A\x07,\x02\x02\u014A\u014B\x05\x1C\x0F\x02\u014B\u0153\x03\x02\x02" +
		"\x02\u014C\u014E\x075\x02\x02\u014D\u014F\x050\x19\x02\u014E\u014D\x03" +
		"\x02\x02\x02\u014E\u014F\x03\x02\x02\x02\u014F\u0150\x03\x02\x02\x02\u0150" +
		"\u0153\x076\x02\x02\u0151\u0153\x07@\x02\x02\u0152\u0148\x03\x02\x02\x02" +
		"\u0152\u014C\x03\x02\x02\x02\u0152\u0151\x03\x02\x02\x02\u0153/\x03\x02" +
		"\x02\x02\u0154\u0159\x05\x1C\x0F\x02\u0155\u0156\x070\x02\x02\u0156\u0158" +
		"\x05\x1C\x0F\x02\u0157\u0155\x03\x02\x02\x02\u0158\u015B\x03\x02\x02\x02" +
		"\u0159\u0157\x03\x02\x02\x02\u0159\u015A\x03\x02\x02\x02\u015A1\x03\x02" +
		"\x02\x02\u015B\u0159\x03\x02\x02\x02#79@ELYjov{\x86\x8E\xB5\xBB\xBE\xD2" +
		"\xD4\xDA\xE3\xEC\xF9\u0106\u010D\u0115\u0119\u0123\u0128\u012F\u0141\u0146" +
		"\u014E\u0152\u0159";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!Re_Parser.__ATN) {
			Re_Parser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(Re_Parser._serializedATN));
		}

		return Re_Parser.__ATN;
	}

}

export class ProgramContext extends ParserRuleContext {
	public PROGRAM(): TerminalNode { return this.getToken(Re_Parser.PROGRAM, 0); }
	public ID(): TerminalNode { return this.getToken(Re_Parser.ID, 0); }
	public LBRACE(): TerminalNode { return this.getToken(Re_Parser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(Re_Parser.RBRACE, 0); }
	public sentence(): SentenceContext[];
	public sentence(i: number): SentenceContext;
	public sentence(i?: number): SentenceContext | SentenceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SentenceContext);
		} else {
			return this.getRuleContext(i, SentenceContext);
		}
	}
	public function_decl(): Function_declContext[];
	public function_decl(i: number): Function_declContext;
	public function_decl(i?: number): Function_declContext | Function_declContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Function_declContext);
		} else {
			return this.getRuleContext(i, Function_declContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_program; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterProgram) {
			listener.enterProgram(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitProgram) {
			listener.exitProgram(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitProgram) {
			return visitor.visitProgram(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Function_declContext extends ParserRuleContext {
	public ID(): TerminalNode { return this.getToken(Re_Parser.ID, 0); }
	public LPAREN(): TerminalNode { return this.getToken(Re_Parser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(Re_Parser.RPAREN, 0); }
	public LBRACE(): TerminalNode { return this.getToken(Re_Parser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(Re_Parser.RBRACE, 0); }
	public type_specifier(): Type_specifierContext | undefined {
		return this.tryGetRuleContext(0, Type_specifierContext);
	}
	public VOID(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.VOID, 0); }
	public param_list(): Param_listContext | undefined {
		return this.tryGetRuleContext(0, Param_listContext);
	}
	public sentence(): SentenceContext[];
	public sentence(i: number): SentenceContext;
	public sentence(i?: number): SentenceContext | SentenceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SentenceContext);
		} else {
			return this.getRuleContext(i, SentenceContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_function_decl; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterFunction_decl) {
			listener.enterFunction_decl(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitFunction_decl) {
			listener.exitFunction_decl(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitFunction_decl) {
			return visitor.visitFunction_decl(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Param_listContext extends ParserRuleContext {
	public type_specifier(): Type_specifierContext[];
	public type_specifier(i: number): Type_specifierContext;
	public type_specifier(i?: number): Type_specifierContext | Type_specifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Type_specifierContext);
		} else {
			return this.getRuleContext(i, Type_specifierContext);
		}
	}
	public ID(): TerminalNode[];
	public ID(i: number): TerminalNode;
	public ID(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(Re_Parser.ID);
		} else {
			return this.getToken(Re_Parser.ID, i);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(Re_Parser.COMMA);
		} else {
			return this.getToken(Re_Parser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_param_list; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterParam_list) {
			listener.enterParam_list(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitParam_list) {
			listener.exitParam_list(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitParam_list) {
			return visitor.visitParam_list(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SentenceContext extends ParserRuleContext {
	public var_decl(): Var_declContext | undefined {
		return this.tryGetRuleContext(0, Var_declContext);
	}
	public var_assign(): Var_assignContext | undefined {
		return this.tryGetRuleContext(0, Var_assignContext);
	}
	public print_statement(): Print_statementContext | undefined {
		return this.tryGetRuleContext(0, Print_statementContext);
	}
	public if_statement(): If_statementContext | undefined {
		return this.tryGetRuleContext(0, If_statementContext);
	}
	public while_statement(): While_statementContext | undefined {
		return this.tryGetRuleContext(0, While_statementContext);
	}
	public do_while_statement(): Do_while_statementContext | undefined {
		return this.tryGetRuleContext(0, Do_while_statementContext);
	}
	public for_statement(): For_statementContext | undefined {
		return this.tryGetRuleContext(0, For_statementContext);
	}
	public return_statement(): Return_statementContext | undefined {
		return this.tryGetRuleContext(0, Return_statementContext);
	}
	public function_call(): Function_callContext | undefined {
		return this.tryGetRuleContext(0, Function_callContext);
	}
	public SEMI(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.SEMI, 0); }
	public method_call(): Method_callContext | undefined {
		return this.tryGetRuleContext(0, Method_callContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_sentence; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterSentence) {
			listener.enterSentence(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitSentence) {
			listener.exitSentence(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitSentence) {
			return visitor.visitSentence(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Print_statementContext extends ParserRuleContext {
	public PRINT(): TerminalNode { return this.getToken(Re_Parser.PRINT, 0); }
	public LPAREN(): TerminalNode { return this.getToken(Re_Parser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(Re_Parser.RPAREN, 0); }
	public SEMI(): TerminalNode { return this.getToken(Re_Parser.SEMI, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_print_statement; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterPrint_statement) {
			listener.enterPrint_statement(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitPrint_statement) {
			listener.exitPrint_statement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitPrint_statement) {
			return visitor.visitPrint_statement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Var_declContext extends ParserRuleContext {
	public ID(): TerminalNode { return this.getToken(Re_Parser.ID, 0); }
	public SEMI(): TerminalNode { return this.getToken(Re_Parser.SEMI, 0); }
	public type_specifier(): Type_specifierContext | undefined {
		return this.tryGetRuleContext(0, Type_specifierContext);
	}
	public VAR(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.VAR, 0); }
	public ASSIGN(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.ASSIGN, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_var_decl; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterVar_decl) {
			listener.enterVar_decl(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitVar_decl) {
			listener.exitVar_decl(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitVar_decl) {
			return visitor.visitVar_decl(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Var_assignContext extends ParserRuleContext {
	public ID(): TerminalNode { return this.getToken(Re_Parser.ID, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public SEMI(): TerminalNode { return this.getToken(Re_Parser.SEMI, 0); }
	public ASSIGN(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.ASSIGN, 0); }
	public PLUS_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.PLUS_ASSIGN, 0); }
	public MINUS_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.MINUS_ASSIGN, 0); }
	public MULT_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.MULT_ASSIGN, 0); }
	public DIV_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.DIV_ASSIGN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_var_assign; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterVar_assign) {
			listener.enterVar_assign(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitVar_assign) {
			listener.exitVar_assign(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitVar_assign) {
			return visitor.visitVar_assign(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Return_statementContext extends ParserRuleContext {
	public RETURN(): TerminalNode { return this.getToken(Re_Parser.RETURN, 0); }
	public SEMI(): TerminalNode { return this.getToken(Re_Parser.SEMI, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_return_statement; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterReturn_statement) {
			listener.enterReturn_statement(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitReturn_statement) {
			listener.exitReturn_statement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitReturn_statement) {
			return visitor.visitReturn_statement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Type_specifierContext extends ParserRuleContext {
	public primitive_type(): Primitive_typeContext | undefined {
		return this.tryGetRuleContext(0, Primitive_typeContext);
	}
	public list_type(): List_typeContext | undefined {
		return this.tryGetRuleContext(0, List_typeContext);
	}
	public array_type(): Array_typeContext | undefined {
		return this.tryGetRuleContext(0, Array_typeContext);
	}
	public collection_type(): Collection_typeContext | undefined {
		return this.tryGetRuleContext(0, Collection_typeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_type_specifier; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterType_specifier) {
			listener.enterType_specifier(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitType_specifier) {
			listener.exitType_specifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitType_specifier) {
			return visitor.visitType_specifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Primitive_typeContext extends ParserRuleContext {
	public INT_TYPE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.INT_TYPE, 0); }
	public DOUBLE_TYPE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.DOUBLE_TYPE, 0); }
	public LONG_TYPE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.LONG_TYPE, 0); }
	public SHORT_TYPE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.SHORT_TYPE, 0); }
	public STRING_TYPE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.STRING_TYPE, 0); }
	public BOOL_TYPE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.BOOL_TYPE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_primitive_type; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterPrimitive_type) {
			listener.enterPrimitive_type(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitPrimitive_type) {
			listener.exitPrimitive_type(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitPrimitive_type) {
			return visitor.visitPrimitive_type(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class List_typeContext extends ParserRuleContext {
	public LIST_TYPE(): TerminalNode { return this.getToken(Re_Parser.LIST_TYPE, 0); }
	public LT(): TerminalNode { return this.getToken(Re_Parser.LT, 0); }
	public primitive_type(): Primitive_typeContext {
		return this.getRuleContext(0, Primitive_typeContext);
	}
	public GT(): TerminalNode { return this.getToken(Re_Parser.GT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_list_type; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterList_type) {
			listener.enterList_type(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitList_type) {
			listener.exitList_type(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitList_type) {
			return visitor.visitList_type(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Array_typeContext extends ParserRuleContext {
	public ARRAY_TYPE(): TerminalNode { return this.getToken(Re_Parser.ARRAY_TYPE, 0); }
	public LT(): TerminalNode { return this.getToken(Re_Parser.LT, 0); }
	public primitive_type(): Primitive_typeContext {
		return this.getRuleContext(0, Primitive_typeContext);
	}
	public GT(): TerminalNode { return this.getToken(Re_Parser.GT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_array_type; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterArray_type) {
			listener.enterArray_type(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitArray_type) {
			listener.exitArray_type(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitArray_type) {
			return visitor.visitArray_type(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Collection_typeContext extends ParserRuleContext {
	public LT(): TerminalNode { return this.getToken(Re_Parser.LT, 0); }
	public primitive_type(): Primitive_typeContext {
		return this.getRuleContext(0, Primitive_typeContext);
	}
	public GT(): TerminalNode { return this.getToken(Re_Parser.GT, 0); }
	public QUEUE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.QUEUE, 0); }
	public STACK(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.STACK, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_collection_type; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterCollection_type) {
			listener.enterCollection_type(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitCollection_type) {
			listener.exitCollection_type(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitCollection_type) {
			return visitor.visitCollection_type(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public OR_KW(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.OR_KW, 0); }
	public OR_OP(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.OR_OP, 0); }
	public AND_KW(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.AND_KW, 0); }
	public AND_OP(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.AND_OP, 0); }
	public GTE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.GTE, 0); }
	public GT(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.GT, 0); }
	public LTE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.LTE, 0); }
	public LT(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.LT, 0); }
	public EQ(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.EQ, 0); }
	public NEQ(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.NEQ, 0); }
	public PLUS(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.PLUS, 0); }
	public MINUS(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.MINUS, 0); }
	public MULT(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.MULT, 0); }
	public DIV(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.DIV, 0); }
	public EXP(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.EXP, 0); }
	public NOT_KW(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.NOT_KW, 0); }
	public NOT_OP(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.NOT_OP, 0); }
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.RPAREN, 0); }
	public literal(): LiteralContext | undefined {
		return this.tryGetRuleContext(0, LiteralContext);
	}
	public ID(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.ID, 0); }
	public function_call(): Function_callContext | undefined {
		return this.tryGetRuleContext(0, Function_callContext);
	}
	public method_call(): Method_callContext | undefined {
		return this.tryGetRuleContext(0, Method_callContext);
	}
	public LBRACKET(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.LBRACKET, 0); }
	public RBRACKET(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.RBRACKET, 0); }
	public list_elements(): List_elementsContext | undefined {
		return this.tryGetRuleContext(0, List_elementsContext);
	}
	public INPUT(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.INPUT, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.STRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_expression; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterExpression) {
			listener.enterExpression(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitExpression) {
			listener.exitExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Function_callContext extends ParserRuleContext {
	public ID(): TerminalNode { return this.getToken(Re_Parser.ID, 0); }
	public LPAREN(): TerminalNode { return this.getToken(Re_Parser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(Re_Parser.RPAREN, 0); }
	public argument_list(): Argument_listContext | undefined {
		return this.tryGetRuleContext(0, Argument_listContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_function_call; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterFunction_call) {
			listener.enterFunction_call(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitFunction_call) {
			listener.exitFunction_call(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitFunction_call) {
			return visitor.visitFunction_call(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Method_callContext extends ParserRuleContext {
	public ID(): TerminalNode[];
	public ID(i: number): TerminalNode;
	public ID(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(Re_Parser.ID);
		} else {
			return this.getToken(Re_Parser.ID, i);
		}
	}
	public DOT(): TerminalNode { return this.getToken(Re_Parser.DOT, 0); }
	public LPAREN(): TerminalNode { return this.getToken(Re_Parser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(Re_Parser.RPAREN, 0); }
	public argument_list(): Argument_listContext | undefined {
		return this.tryGetRuleContext(0, Argument_listContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_method_call; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterMethod_call) {
			listener.enterMethod_call(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitMethod_call) {
			listener.exitMethod_call(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitMethod_call) {
			return visitor.visitMethod_call(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Argument_listContext extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(Re_Parser.COMMA);
		} else {
			return this.getToken(Re_Parser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_argument_list; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterArgument_list) {
			listener.enterArgument_list(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitArgument_list) {
			listener.exitArgument_list(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitArgument_list) {
			return visitor.visitArgument_list(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LiteralContext extends ParserRuleContext {
	public INT(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.INT, 0); }
	public DOUBLE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.DOUBLE, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.STRING, 0); }
	public BOOL(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.BOOL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_literal; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterLiteral) {
			listener.enterLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitLiteral) {
			listener.exitLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitLiteral) {
			return visitor.visitLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class If_statementContext extends ParserRuleContext {
	public IF(): TerminalNode[];
	public IF(i: number): TerminalNode;
	public IF(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(Re_Parser.IF);
		} else {
			return this.getToken(Re_Parser.IF, i);
		}
	}
	public LPAREN(): TerminalNode[];
	public LPAREN(i: number): TerminalNode;
	public LPAREN(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(Re_Parser.LPAREN);
		} else {
			return this.getToken(Re_Parser.LPAREN, i);
		}
	}
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public RPAREN(): TerminalNode[];
	public RPAREN(i: number): TerminalNode;
	public RPAREN(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(Re_Parser.RPAREN);
		} else {
			return this.getToken(Re_Parser.RPAREN, i);
		}
	}
	public LBRACE(): TerminalNode[];
	public LBRACE(i: number): TerminalNode;
	public LBRACE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(Re_Parser.LBRACE);
		} else {
			return this.getToken(Re_Parser.LBRACE, i);
		}
	}
	public RBRACE(): TerminalNode[];
	public RBRACE(i: number): TerminalNode;
	public RBRACE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(Re_Parser.RBRACE);
		} else {
			return this.getToken(Re_Parser.RBRACE, i);
		}
	}
	public sentence(): SentenceContext[];
	public sentence(i: number): SentenceContext;
	public sentence(i?: number): SentenceContext | SentenceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SentenceContext);
		} else {
			return this.getRuleContext(i, SentenceContext);
		}
	}
	public ELSE(): TerminalNode[];
	public ELSE(i: number): TerminalNode;
	public ELSE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(Re_Parser.ELSE);
		} else {
			return this.getToken(Re_Parser.ELSE, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_if_statement; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterIf_statement) {
			listener.enterIf_statement(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitIf_statement) {
			listener.exitIf_statement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitIf_statement) {
			return visitor.visitIf_statement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class While_statementContext extends ParserRuleContext {
	public WHILE(): TerminalNode { return this.getToken(Re_Parser.WHILE, 0); }
	public LPAREN(): TerminalNode { return this.getToken(Re_Parser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(Re_Parser.RPAREN, 0); }
	public LBRACE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.LBRACE, 0); }
	public RBRACE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.RBRACE, 0); }
	public sentence(): SentenceContext[];
	public sentence(i: number): SentenceContext;
	public sentence(i?: number): SentenceContext | SentenceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SentenceContext);
		} else {
			return this.getRuleContext(i, SentenceContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_while_statement; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterWhile_statement) {
			listener.enterWhile_statement(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitWhile_statement) {
			listener.exitWhile_statement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitWhile_statement) {
			return visitor.visitWhile_statement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Do_while_statementContext extends ParserRuleContext {
	public DO(): TerminalNode { return this.getToken(Re_Parser.DO, 0); }
	public LBRACE(): TerminalNode { return this.getToken(Re_Parser.LBRACE, 0); }
	public RBRACE(): TerminalNode { return this.getToken(Re_Parser.RBRACE, 0); }
	public WHILE(): TerminalNode { return this.getToken(Re_Parser.WHILE, 0); }
	public LPAREN(): TerminalNode { return this.getToken(Re_Parser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(Re_Parser.RPAREN, 0); }
	public SEMI(): TerminalNode { return this.getToken(Re_Parser.SEMI, 0); }
	public sentence(): SentenceContext[];
	public sentence(i: number): SentenceContext;
	public sentence(i?: number): SentenceContext | SentenceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SentenceContext);
		} else {
			return this.getRuleContext(i, SentenceContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_do_while_statement; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterDo_while_statement) {
			listener.enterDo_while_statement(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitDo_while_statement) {
			listener.exitDo_while_statement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitDo_while_statement) {
			return visitor.visitDo_while_statement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class For_statementContext extends ParserRuleContext {
	public FOR(): TerminalNode { return this.getToken(Re_Parser.FOR, 0); }
	public ID(): TerminalNode { return this.getToken(Re_Parser.ID, 0); }
	public IN(): TerminalNode { return this.getToken(Re_Parser.IN, 0); }
	public for_expression(): For_expressionContext {
		return this.getRuleContext(0, For_expressionContext);
	}
	public LBRACE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.LBRACE, 0); }
	public RBRACE(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.RBRACE, 0); }
	public sentence(): SentenceContext[];
	public sentence(i: number): SentenceContext;
	public sentence(i?: number): SentenceContext | SentenceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SentenceContext);
		} else {
			return this.getRuleContext(i, SentenceContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_for_statement; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterFor_statement) {
			listener.enterFor_statement(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitFor_statement) {
			listener.exitFor_statement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitFor_statement) {
			return visitor.visitFor_statement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class For_expressionContext extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public DOTDOT(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.DOTDOT, 0); }
	public LBRACKET(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.LBRACKET, 0); }
	public RBRACKET(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.RBRACKET, 0); }
	public list_elements(): List_elementsContext | undefined {
		return this.tryGetRuleContext(0, List_elementsContext);
	}
	public ID(): TerminalNode | undefined { return this.tryGetToken(Re_Parser.ID, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_for_expression; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterFor_expression) {
			listener.enterFor_expression(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitFor_expression) {
			listener.exitFor_expression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitFor_expression) {
			return visitor.visitFor_expression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class List_elementsContext extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(Re_Parser.COMMA);
		} else {
			return this.getToken(Re_Parser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return Re_Parser.RULE_list_elements; }
	// @Override
	public enterRule(listener: Re_ParserListener): void {
		if (listener.enterList_elements) {
			listener.enterList_elements(this);
		}
	}
	// @Override
	public exitRule(listener: Re_ParserListener): void {
		if (listener.exitList_elements) {
			listener.exitList_elements(this);
		}
	}
	// @Override
	public accept<Result>(visitor: Re_ParserVisitor<Result>): Result {
		if (visitor.visitList_elements) {
			return visitor.visitList_elements(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


