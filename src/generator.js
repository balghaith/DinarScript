import * as core from "./core.js"

export default function generate(program) {
  const output = []

  const targetName = (mapping => {
    return entity => {
      if (!mapping.has(entity)) mapping.set(entity, mapping.size + 1)
      return `${entity.name}_${mapping.get(entity)}`
    }
  })(new Map())

  const gen = node => generators?.[node?.kind]?.(node)

  const emit = line => output.push(line)

  const jsOp = op =>
    (
      {
        "==": "===",
        "!=": "!==",
        and: "&&",
        or: "||",
      }[op] ?? op
    )

  const isNum = n => n?.kind === "NumberLiteral"
  const isBool = b => b?.kind === "BooleanLiteral"

  const asValue = e => {
    if (isNum(e)) return e.value
    if (isBool(e)) return e.value
    if (e?.kind === "StringLiteral") return JSON.stringify(e.value)
    return gen(e)
  }

  const generators = {
    Program(p) {
      p.statements.forEach(s => {
        const r = gen(s)
        if (Array.isArray(r)) r.forEach(emit)
      })
    },

    VariableDeclaration(d) {
      emit(`let ${gen(d.variable)} = ${gen(d.initializer)};`)
    },

    Variable(v) {
      return targetName(v)
    },

    Identifier(e) {
      return targetName(e.ref ?? { name: e.name })
    },

    Assignment(s) {
      emit(`${gen(s.target)} = ${gen(s.source)};`)
    },

    ShowStatement(s) {
      emit(`console.log(${gen(s.expression)});`)
    },

    BreakStatement() {
      emit("break;")
    },

    ReturnStatement(s) {
      emit(`return ${gen(s.expression)};`)
    },

    ShortReturnStatement() {
      emit("return;")
    },

    FunctionDeclaration(d) {
      const f = d.fun
      emit(`function ${targetName(f)}(${f.params.map(targetName).join(", ")}) {`)
      f.body.forEach(gen)
      emit("}")
    },

    IfStatement(s) {
      emit(`if (${gen(s.test)}) {`)
      s.thenBlock.forEach(gen)
      if (s.elseBlock.length > 0) {
        emit("} else {")
        s.elseBlock.forEach(gen)
        emit("}")
      } else {
        emit("}")
      }
    },

    WhileStatement(s) {
      emit(`while (${gen(s.test)}) {`)
      s.body.forEach(gen)
      emit("}")
    },

    RecordDeclaration(d) {
      const t = d.type
      emit(`class ${targetName(t)} {`)
      emit(`constructor(${t.fields.map(targetName).join(", ")}) {`)
      for (const f of t.fields) {
        emit(`this[${JSON.stringify(targetName(f))}] = ${targetName(f)};`)
      }
      emit("}")
      emit("}")
    },

    RecordType(t) {
      return targetName(t)
    },

    Field(f) {
      return targetName(f)
    },

    ConstructorCall(c) {
      return `new ${targetName(c.callee)}(${c.args.map(gen).join(", ")})`
    },

    FunctionCall(c) {
      return `${gen(c.callee)}(${c.args.map(gen).join(", ")})`
    },

    FieldAccess(e) {
      const object = gen(e.object)
      const field = JSON.stringify(gen(e.field))
      return `(${object}[${field}])`
    },

    NumberLiteral(e) {
      return `${e.value}`
    },

    BooleanLiteral(e) {
      return `${e.value}`
    },

    StringLiteral(e) {
      return JSON.stringify(e.value)
    },

    UnaryExpression(e) {
      const op = e.op === "not" ? "!" : e.op
      return `(${op}(${gen(e.operand)}))`.replace("!(", "(!")
    },

    BinaryExpression(e) {
      const op = jsOp(e.op)
      return `(${gen(e.left)} ${op} ${gen(e.right)})`
    },

    MatchStatement(s) {
      const temp = { name: "__match" }
      const tempName = targetName(temp)
      emit("{")
      emit(`const ${tempName} = ${gen(s.exp)};`)
      const cases = s.cases
      const first = cases[0]
      emit(`if (${genMatchTest(tempName, first.pattern)}) {`)
      first.block.forEach(gen)
      for (const c of cases.slice(1)) {
        emit(`} else if (${genMatchTest(tempName, c.pattern)}) {`)
        c.block.forEach(gen)
      }
      emit("} else {")
      emit("}")
      emit("}")
    },

    Case() {
      return ""
    },

    WildcardPattern() {
      return ""
    },
  }

  const genMatchTest = (tempName, pattern) => {
    if (pattern.kind === "WildcardPattern") return "true"
    if (pattern.kind === "BooleanLiteral") return `(${tempName} === ${pattern.value})`
    if (pattern.kind === "NumberLiteral") return `(${tempName} === ${pattern.value})`
    if (pattern.kind === "StringLiteral") return `(${tempName} === ${JSON.stringify(pattern.value)})`
    if (pattern.kind === "MoneyLiteral") return `(${tempName} === ${JSON.stringify(pattern.text)})`
    return "true"
  }

  gen(program)
  return output.join("\n")
}