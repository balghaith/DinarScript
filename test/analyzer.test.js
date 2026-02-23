import { describe, test } from "node:test"
import assert from "node:assert/strict"
import { match } from "../src/parser.js"
import analyze from "../src/analyzer.js"
import * as core from "../src/core.js"

const semanticChecks = [
  ["variable declarations", "let x = 1; final y = false;"],
  ["typed declarations", "let x: Dec = 1; let s: String = \"hi\";"],
  ["assignment to let", "let x = 1; x = 2;"],
  ["show statement", "show(1);"],
  ["expression statement", "(1 + 2) * 3;"],
  ["if without else", "if true: show(1); end"],
  ["if with else", "if true: show(1); else: show(2); end"],
  ["while with break", "while true: break; end"],
  ["function void return", "fun v() -> Void: return; end"],
  ["function return value", "fun add(x: Dec, y: Dec) -> Dec: return x + y; end"],
  ["record declaration", "record Person { public name: String; private age: Dec; }"],
  ["match wildcard", "match 1: case _: show(1); end"],
  ["match with binding id", "match 1: case x: show(x); end"],
  ["money literals", "let a = 1kd; let b = 250fils; let c = 1kd50fils;"],
  ["money constructors", "let a = kd(3); let b = fils(250);"],
  ["unary not", "show(not false);"],
  ["equality", "show(1 == 1); show(1 != 2);"],
  ["relations", "show(1 < 2); show(2 >= 2);"],
  ["and/or", "show(true and false); show(true or false);"],
]

const semanticErrors = [
  ["break outside loop", "break;", /Break can only appear in a loop/],
  ["return outside function", "return;", /Return can only appear in a function/],
  ["redeclared id", "let x = 1; let x = 2;", /Identifier x already declared/],
  ["undeclared id in expression", "show(x);", /Identifier x not declared/],
  ["assign to final", "final x = 1; x = 2;", /Cannot assign to immutable variable/],
  ["if test not boolean", "if 1: show(1); end", /Expected a boolean/],
  ["while test not boolean", "while 1: break; end", /Expected a boolean/],
  ["not operand not boolean", "show(not 1);", /Expected a boolean/],
  ["unary - on non-number", "show(-true);", /Expected a number/],
  ["and expects booleans", "show(true and 1);", /Expected a boolean/],
  ["or expects booleans", "show(false or 1);", /Expected a boolean/],
  ["== operands different types", "show(1 == true);", /Operands do not have the same type/],
  ["!= operands different types", "show(1 != true);", /Operands do not have the same type/],
  ["relational operands must match type", "show(1 < true);", /Operands do not have the same type/],
  ["+ mismatched types", "show(1 + true);", /Operands do not have the same type/],
  ["* requires numbers", "show(true * 2);", /Expected a number/],
  ["assignment type mismatch", "let x: Dec = 1; x = true;", /Cannot assign a Bool to a Dec/],
  ["match literal pattern wrong type", "match 1: case true: show(1); end", /Operands do not have the same type/],
  ["record fields must be distinct", "record R { public x: Dec; private x: Dec; }", /Fields must be distinct/],
]

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    test(`recognizes ${scenario}`, () => {
      const m = match(source)
      assert.ok(m.succeeded())
      assert.ok(analyze(m))
    })
  }

  for (const [scenario, source, errorPattern] of semanticErrors) {
    test(`throws on ${scenario}`, () => {
      const m = match(source)
      assert.ok(m.succeeded())
      assert.throws(() => analyze(m), errorPattern)
    })
  }

  test("produces the expected representation for a trivial program", () => {
    const rep = analyze(match("let x = 1 + 2;"))
    assert.strictEqual(rep.kind, "Program")
    assert.strictEqual(rep.statements.length, 1)
    assert.strictEqual(rep.statements[0].kind, "VariableDeclaration")
  })

  test("representation includes typed binary node", () => {
    const rep = analyze(match("let x = 1 + 2;"))
    const decl = rep.statements[0]
    assert.strictEqual(decl.initializer.kind, "BinaryExpression")
    assert.strictEqual(decl.initializer.op, "+")
    assert.strictEqual(decl.initializer.type, core.decType)
  })
})
