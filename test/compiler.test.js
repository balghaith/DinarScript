import { describe, it } from "node:test"
import assert from "node:assert/strict"
import compile from "../src/compiler.js"

const sampleProgram = "show(0);"

describe("The compiler", () => {
  it("throws when the output type is missing", () => {
    assert.throws(() => compile(sampleProgram), /Unknown output type/)
  })

  it("throws when the output type is unknown", () => {
    assert.throws(() => compile(sampleProgram, "no such type"), /Unknown output type/)
  })

  it("throws on syntax error", () => {
    assert.throws(() => compile("let x =", "parsed"))
  })

  it("accepts the parsed option", () => {
    const compiled = compile(sampleProgram, "parsed")
    assert.ok(compiled.startsWith("Syntax is ok"))
  })

  it("accepts the analyzed option", () => {
    const compiled = compile(sampleProgram, "analyzed")
    assert.equal(compiled.kind, "Program")
  })

  it("accepts the optimized option", () => {
    const compiled = compile(sampleProgram, "optimized")
    assert.equal(compiled.kind, "Program")
  })

  it("generates js code when given the js option", () => {
    const compiled = compile(sampleProgram, "js")
    assert.equal(typeof compiled, "string")
  })

  it("compiles variable declarations", () => {
    const compiled = compile("let x = 1;", "analyzed")
    assert.equal(compiled.kind, "Program")
  })

  it("compiles money literals", () => {
    const compiled = compile("let x = 1kd;", "analyzed")
    assert.equal(compiled.kind, "Program")
  })

  it("compiles money constructors", () => {
    const compiled = compile("let x = kd(3); let y = fils(250);", "analyzed")
    assert.equal(compiled.kind, "Program")
  })

  it("compiles function declarations", () => {
    const program = `
      fun add(x: Dec, y: Dec) -> Dec:
        return x + y;
      end
    `
    const compiled = compile(program, "analyzed")
    assert.equal(compiled.kind, "Program")
  })

  it("compiles if statement", () => {
    const program = `
      if true:
        show(1);
      end
    `
    const compiled = compile(program, "optimized")
    assert.equal(compiled.kind, "Program")
  })

  it("compiles while loop with break", () => {
    const program = `
      while true:
        break;
      end
    `
    const compiled = compile(program, "optimized")
    assert.equal(compiled.kind, "Program")
  })

  it("compiles record declaration", () => {
    const program = `
      record Person {
        public name: String;
        private age: Dec;
      }
    `
    const compiled = compile(program, "analyzed")
    assert.equal(compiled.kind, "Program")
  })

  it("compiles match statement", () => {
    const program = `
      match 1:
        case 1: show(1);
        case _: show(2);
      end
    `
    const compiled = compile(program, "analyzed")
    assert.equal(compiled.kind, "Program")
  })
})
  