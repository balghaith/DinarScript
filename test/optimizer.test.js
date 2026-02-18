import { describe, it } from "node:test"
import assert from "node:assert/strict"
import optimize from "../src/optimizer.js"
import * as core from "../src/core.js"

const num = n => ({ kind: "NumberLiteral", value: n, type: core.decType })
const bool = b => ({ kind: "BooleanLiteral", value: b, type: core.boolType })
const str = s => ({ kind: "StringLiteral", value: s, type: core.stringType })

const x = core.variable("x", true, core.decType)
const y = core.variable("y", true, core.decType)

const show = e => ({ kind: "ShowStatement", expression: e })
const ret = e => core.returnStatement(e)
const assign = (t, s) => core.assignment(t, s)

const prog = statements => core.program(statements)

const bin = (op, left, right, type) => core.binary(op, left, right, type)
const un = (op, operand, type) => core.unary(op, operand, type)

const ifs = (test, thenBlock, elseBlock) => ({
  kind: "IfStatement",
  test,
  thenBlock,
  elseBlock,
})

const whiles = (test, body) => core.whileStatement(test, body)

const tests = [
  ["folds +", bin("+", num(5), num(8), core.decType), num(13)],
  ["folds -", bin("-", num(5), num(8), core.decType), num(-3)],
  ["folds *", bin("*", num(5), num(8), core.decType), num(40)],
  ["folds /", bin("/", num(5), num(8), core.decType), num(0.625)],
  ["folds ==", bin("==", num(5), num(8), core.boolType), bool(false)],
  ["folds !=", bin("!=", num(5), num(8), core.boolType), bool(true)],
  ["folds <", bin("<", num(5), num(8), core.boolType), bool(true)],
  ["folds <=", bin("<=", num(5), num(8), core.boolType), bool(true)],
  ["folds >", bin(">", num(5), num(8), core.boolType), bool(false)],
  ["folds >=", bin(">=", num(5), num(8), core.boolType), bool(false)],

  ["optimizes x+0", bin("+", x, num(0), core.decType), x],
  ["optimizes 0+x", bin("+", num(0), x, core.decType), x],
  ["optimizes x-0", bin("-", x, num(0), core.decType), x],
  ["optimizes x*1", bin("*", x, num(1), core.decType), x],
  ["optimizes 1*x", bin("*", num(1), x, core.decType), x],
  ["optimizes x/1", bin("/", x, num(1), core.decType), x],
  ["optimizes x*0", bin("*", x, num(0), core.decType), num(0)],
  ["optimizes 0*x", bin("*", num(0), x, core.decType), num(0)],
  ["optimizes 0/x", bin("/", num(0), x, core.decType), num(0)],

  ["folds unary -", un("-", num(8), core.decType), num(-8)],
  ["folds unary not", un("not", bool(false), core.boolType), bool(true)],

  ["optimizes true and E", bin("and", bool(true), bin("<", x, num(1), core.boolType), core.boolType), bin("<", x, num(1), core.boolType)],
  ["optimizes E and true", bin("and", bin("<", x, num(1), core.boolType), bool(true), core.boolType), bin("<", x, num(1), core.boolType)],
  ["optimizes false or E", bin("or", bool(false), bin("<", x, num(1), core.boolType), core.boolType), bin("<", x, num(1), core.boolType)],
  ["optimizes E or false", bin("or", bin("<", x, num(1), core.boolType), bool(false), core.boolType), bin("<", x, num(1), core.boolType)],

  ["removes x=x at beginning", prog([assign(x, x), show(x)]), prog([show(x)])],
  ["removes x=x at end", prog([show(x), assign(x, x)]), prog([show(x)])],
  ["removes x=x in middle", prog([show(x), assign(x, x), show(y)]), prog([show(x), show(y)])],

  ["optimizes if-true", ifs(bool(true), [show(num(1))], [show(num(2))]), [show(num(1))]],
  ["optimizes if-false", ifs(bool(false), [show(num(1))], [show(num(2))]), [show(num(2))]],

  ["optimizes while-false in program", prog([whiles(bool(false), [show(num(1))])]), prog([])],

  ["optimizes inside show", show(bin("+", num(1), num(2), core.decType)), show(num(3))],
  ["optimizes inside return", ret(bin("*", num(3), num(5), core.decType)), ret(num(15))],

  ["optimizes inside nested program", prog([show(bin("+", num(1), num(2), core.decType)), show(bin("*", num(2), num(3), core.decType))]), prog([show(num(3)), show(num(6))])],

  ["passes through string ops without folding", bin("+", str("a"), str("b"), core.stringType), bin("+", str("a"), str("b"), core.stringType)],
]

describe("The optimizer", () => {
  for (const [scenario, before, after] of tests) {
    it(`${scenario}`, () => {
      assert.deepEqual(optimize(before), after)
    })
  }
})