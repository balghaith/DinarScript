import { describe, test } from "node:test"
import assert from "node:assert/strict"
import { match } from "../src/parser.js"
import analyze, {isType} from "../src/analyzer.js"
import * as core from "../src/core.js"

const semanticChecks = [
  ["variable declarations", "let x = 1; final y = false;"],
  ["typed declarations", "let x: Dec = 1.0; let s: String = \"hi\";"],
  ["assignment to let", "let x = 1; x = 2;"],
  ["show statement", "show(1);"],
  ["expression statement", "(1 + 2) * 3;"],
  ["if without else", "if true: show(1); end"],
  ["if with else", "if true: show(1); else: show(2); end"],
  ["while with break", "while true: break; end"],
  ["function void return", "fun v(p: Bool) -> Void: return; end"],
  ["function return value", "fun add(x: KD, y: Dec) -> Dec: return x + y; end"],
  ["call", "fun id(x: KD) -> KD: return x; end show(id(5));"],
  ["kd whole literals", "show(2kd);"],
  ["record declaration", "record Person { public name: String; private age: Dec; }"],
  ["match wildcard", "match 1: case _: show(1); end"],
  ["match with binding id", "match 1: case x: show(x); end"],
  ["match string literal", "match \"hi\": case \"hi\": show(1); end"],
  ["money literals", "let a = 1kd; let b = 250fils; let c = 1kd50fils;"],
  ["money constructors", "let a = kd(3); let b = fils(250);"],
  ["kd constructor in match", "match kd(5): case kd(5): show(1); end"],
  ["kd addition", "show(1kd + 2kd);"],
  ["kd subtraction", "show(3kd - 1kd);"],
  ["relational operators with kds", "show(1kd < 2kd);"],
  ["relational operators with strings", `show("a" < "b");`],
  ["unary not", "show(not false);"],
  ["equality", "show(1 == 1); show(1 != 2);"],
  ["relations", "show(1 < 2); show(2 >= 2);"],
  ["and/or", "show(true and false); show(true or false);"],
  ["adds two strings", `show("a" + "b");`],
  ["adds two decimals", "show(1 + 2);"],
  ["call", "fun add(x: KD, y: Dec) -> Dec: return x + y; end show(add(1,2));"],
  ["function type description", "fun f(x: KD, y: Dec) -> Dec: return x + y; end"]
  ,
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
  ["match literal pattern wrong type", "match 1: case true: show(1); end", /Expected a boolean/],
  ["record fields must be distinct", "record R { public x: Dec; private x: Dec; }", /Fields must be distinct/],
  ["function assigned to kd", "fun f(x: KD) -> KD: return x; end let y: KD = f;", /Operands|Cannot assign|Expected/],
  ["assign a record to a dec", `record Person { public name: String; } let p = Person("Faisal"); let x: Dec = p;`, /Identifier|Cannot assign|Expected/],
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

  test("isType returns false for non-type", () => {
    assert.ok(!isType({}))
    assert.ok(!(isType(false)))
  })

  test("isType returns true for diffrent values", () => {
    assert.ok(isType(core.boolType))
    assert.ok(isType(core.kdType))
    assert.ok(isType(core.stringType))
    assert.ok(isType(core.decType))
    assert.ok(isType(core.voidType))
    assert.ok(isType("bader"))
    assert.ok(isType({ kind: "RecordType" }))
    assert.ok(isType({ kind: "FunctionType" }))
  })

  test("produces the expected representation for a trivial program", () => {
    const rep = analyze(match("let x = 1 + 2;"))
    assert.strictEqual(rep.kind, "Program")
    assert.strictEqual(rep.statements.length, 1)
    assert.strictEqual(rep.statements[0].kind, "VariableDeclaration")
  })

  test("analyzes function with omitted return type", () => {
    const m = match("fun f(x: KD): show(x); end")
    assert.ok(m.succeeded())
    assert.ok(analyze(m))
  })

  test("representation includes typed binary node", () => {
    const rep = analyze(match("let x = 1 + 2;"))
    const decl = rep.statements[0]
    assert.strictEqual(decl.initializer.kind, "BinaryExpression")
    assert.strictEqual(decl.initializer.op, "+")
    assert.strictEqual(decl.initializer.type, core.decType)
  })

  test("prints void type in assignment error", () => {
    const m = match("fun f() -> Void: return; end let x: KD = f;")
    assert.ok(m.succeeded())
    assert.throws(() => analyze(m))
  })
})