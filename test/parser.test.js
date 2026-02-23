import { describe, test } from "node:test"
import assert from "node:assert/strict"
import { match } from "../src/parser.js"

const syntaxChecks = [
  ["simplest program", "break;"],
  ["multiple statements", 'show(1); break; let x = 5; return;'],
  ["let and final", "let e = 99 * 1; final z = false;"],
  ["typed declarations", "let x: Int = 1; final y: Bool = true;"],
  ["string literal", 'let s = "hello"; show(s);'],
  ["assignment", "let x = 1; x = 2;"],
  ["unary ops", "let x = -1; let y = not false;"],
  ["arithmetic precedence", "show(2 * 3 + 4 / 2 - 1);"],
  ["comparisons", "show(1 < 2); show(1 <= 2); show(2 > 1); show(2 >= 2);"],
  ["equality", "show(1 == 1); show(1 != 2);"],
  ["and/or chaining", "show(true and false); show(true or false);"],
  ["parentheses", "show((1 + 2) * 3);"],
  ["money literals", "let a = 1kd; let b = 250fils; let c = 1kd50fils;"],
  ["money constructors", "let a = kd(3); let b = fils(250);"],
  ["if without else", "if true: show(1); end"],
  ["if with else", "if true: show(1); else: show(2); end"],
  ["while with break", "while true: break; end"],
  ["function no params no return type", "fun f(): show(1); end"],
  ["function with params and return type", "fun add(x: Int, y: Int) -> Int: return x + y; end"],
  ["function return without value", "fun v() -> Void: return; end"],
  ["record with fields", "record Person { public name: String; private age: Int; }"],
  ["match with wildcard", "match 1: case _: show(1); end"],
  ["match with many patterns", 'match 1: case 1: show(1); case true: show(2); case "x": show(3); case 1kd: show(4); case _: show(5); end'],
  ["postfix field access", "let x = a.b;"],
  ["postfix call", "f(1, 2, 3);"],
  ["chained postfix", "a.b(1).c;"],
  ["comments", 'let x = 1; // hi\nshow(x);'],
]

const syntaxErrors = [
  ["empty program", ""],
  ["missing semicolon", "let x = 1"],
  ["missing identifier in decl", "let = 1;"],
  ["reserved word as id", "let if = 1;"],
  ["bad type name", "let x: Integer = 1;"],
  ["record missing semicolon in field", "record R { public x: Int }"],
  ["fun missing end", "fun f(): show(1);"],
  ["if missing end", "if true: show(1);"],
  ["while missing end", "while true: break;"],
  ["match missing end", "match 1: case _: show(1);"],
  ["kd ctor wrong arg", "let x = kd(true);"],
  ["fils ctor wrong arg", "let x = fils(2.5);"],
  ["bad money suffix", "let x = 10kdd;"],
  ["garbage", "$$$"],
]

describe("The parser", () => {
  for (const [scenario, source] of syntaxChecks) {
    test(`matches ${scenario}`, () => {
      const m = match(source)
      assert.ok(m.succeeded())
    })
  }

  for (const [scenario, source] of syntaxErrors) {
    test(`rejects ${scenario}`, () => {
      const m = match(source)
      assert.ok(!m.succeeded())
      assert.strictEqual(typeof m.message, "string")
    })
  }
})
