import * as core from "./core.js"

const isNum = n => n?.kind === "NumberLiteral"
const isBool = b => b?.kind === "BooleanLiteral"

const zero = n => isNum(n) && n.value === 0
const one = n => isNum(n) && n.value === 1

const num = n => ({ kind: "NumberLiteral", value: n, type: core.decType })
const bool = b => ({ kind: "BooleanLiteral", value: b, type: core.boolType })

export default function optimize(node) {
  return optimizers?.[node?.kind]?.(node) ?? node
}

const optimizers = {
  Program(p) {
    p.statements = p.statements.flatMap(s => {
      const o = optimize(s)
      return Array.isArray(o) ? o : [o]
    })
    return p
  },

  VariableDeclaration(d) {
    d.variable = optimize(d.variable)
    d.initializer = optimize(d.initializer)
    return d
  },

  FunctionDeclaration(d) {
    d.fun = optimize(d.fun)
    return d
  },

  Function(f) {
    if (f.body) {
      f.body = f.body.flatMap(s => {
        const o = optimize(s)
        return Array.isArray(o) ? o : [o]
      })
    }
    return f
  },

  Assignment(s) {
    s.target = optimize(s.target)
    s.source = optimize(s.source)
    if (s.target === s.source) return []
    return s
  },

  WhileStatement(s) {
    s.test = optimize(s.test)
    if (isBool(s.test) && s.test.value === false) return []
    s.body = s.body.flatMap(st => {
      const o = optimize(st)
      return Array.isArray(o) ? o : [o]
    })
    return s
  },

  IfStatement(s) {
    s.test = optimize(s.test)
    s.thenBlock = s.thenBlock.flatMap(st => {
      const o = optimize(st)
      return Array.isArray(o) ? o : [o]
    })
    s.elseBlock = s.elseBlock.flatMap(st => {
      const o = optimize(st)
      return Array.isArray(o) ? o : [o]
    })
    if (isBool(s.test)) return s.test.value ? s.thenBlock : s.elseBlock
    return s
  },

  ShowStatement(s) {
    s.expression = optimize(s.expression)
    return s
  },

  ReturnStatement(s) {
    s.expression = optimize(s.expression)
    return s
  },

  UnaryExpression(e) {
    e.operand = optimize(e.operand)
    if (e.op === "-" && isNum(e.operand)) return num(-e.operand.value)
    if (e.op === "not" && isBool(e.operand)) return bool(!e.operand.value)
    return e
  },

  BinaryExpression(e) {
    e.left = optimize(e.left)
    e.right = optimize(e.right)

    if (e.op === "and") {
      if (isBool(e.left) && e.left.value === true) return e.right
      if (isBool(e.right) && e.right.value === true) return e.left
      if (isBool(e.left) && e.left.value === false) return e.left
      if (isBool(e.right) && e.right.value === false) return e.right
      if (isBool(e.left) && isBool(e.right)) return bool(e.left.value && e.right.value)
      return e
    }

    if (e.op === "or") {
      if (isBool(e.left) && e.left.value === false) return e.right
      if (isBool(e.right) && e.right.value === false) return e.left
      if (isBool(e.left) && e.left.value === true) return e.left
      if (isBool(e.right) && e.right.value === true) return e.right
      if (isBool(e.left) && isBool(e.right)) return bool(e.left.value || e.right.value)
      return e
    }

    if (e.op === "==" || e.op === "!=") {
      if (isNum(e.left) && isNum(e.right)) {
        return bool(e.op === "==" ? e.left.value === e.right.value : e.left.value !== e.right.value)
      }
      if (isBool(e.left) && isBool(e.right)) {
        return bool(e.op === "==" ? e.left.value === e.right.value : e.left.value !== e.right.value)
      }
      return e
    }

    if (["<", "<=", ">", ">="].includes(e.op)) {
      if (isNum(e.left) && isNum(e.right)) {
        if (e.op === "<") return bool(e.left.value < e.right.value)
        if (e.op === "<=") return bool(e.left.value <= e.right.value)
        if (e.op === ">") return bool(e.left.value > e.right.value)
        if (e.op === ">=") return bool(e.left.value >= e.right.value)
      }
      return e
    }

    if (["+", "-", "*", "/"].includes(e.op)) {
      if (isNum(e.left) && isNum(e.right)) {
        if (e.op === "+") return num(e.left.value + e.right.value)
        if (e.op === "-") return num(e.left.value - e.right.value)
        if (e.op === "*") return num(e.left.value * e.right.value)
        if (e.op === "/") return num(e.left.value / e.right.value)
      }

      if (e.op === "+" && zero(e.right)) return e.left
      if (e.op === "+" && zero(e.left)) return e.right
      if (e.op === "-" && zero(e.right)) return e.left
      if (e.op === "*" && one(e.right)) return e.left
      if (e.op === "*" && one(e.left)) return e.right
      if (e.op === "/" && one(e.right)) return e.left
      if (e.op === "*" && (zero(e.right) || zero(e.left))) return num(0)
      if (e.op === "/" && zero(e.left)) return num(0)
      return e
    }

    return e
  },
}