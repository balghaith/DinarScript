import * as core from "./core.js"

class Context {
  constructor({ parent = null, locals = new Map(), inLoop = false, function: f = null }) {
    Object.assign(this, { parent, locals, inLoop, function: f })
  }
  add(name, entity) {
    this.locals.set(name, entity)
  }
  lookup(name) {
    return this.locals.get(name) || this.parent?.lookup(name)
  }
  static root() {
    const std = core.standardLibrary ? Object.entries(core.standardLibrary) : []
    return new Context({ locals: new Map(std) })
  }
  newChildContext(props = {}) {
    return new Context({ ...this, ...props, parent: this, locals: new Map() })
  }
}

function isType(x) {
  if (!x) return false
  if (typeof x === "string") return true
  if (x === core.intType) return true
  if (x === core.boolType) return true
  if (x === core.stringType) return true
  if (x === core.decType) return true
  if (x === core.kdType) return true
  if (x === core.voidType) return true
  if (x.kind === "RecordType") return true
  if (x.kind === "FunctionType") return true
  return false
}

function equivalent(t1, t2) {
  return t1 === t2
}

function assignable(fromType, toType) {
  if (toType === core.anyType) return true
  return equivalent(fromType, toType)
}

function typeDescription(type) {
  if (type === core.intType) return "Int"
  if (type === core.boolType) return "Bool"
  if (type === core.stringType) return "String"
  if (type === core.decType) return "Dec"
  if (type === core.kdType) return "KD"
  if (type === core.voidType) return "Void"
  if (type?.kind === "RecordType") return type.name
  if (type?.kind === "FunctionType") {
    const ps = (type.paramTypes ?? []).map(typeDescription).join(", ")
    const r = typeDescription(type.returnType)
    return `(${ps})->${r}`
  }
  return "Unknown"
}

export default function analyze(match) {
  if (!match?.succeeded?.()) {
    const message = match?.message ?? "Syntax error"
    throw new Error(message)
  }

  let context = Context.root()

  function must(condition, message, errorLocation) {
    if (!condition) {
      const prefix = errorLocation?.at?.source?.getLineAndColumnMessage?.() ?? ""
      throw new Error(`${prefix}${message}`)
    }
  }

  function mustNotAlreadyBeDeclared(name, at) {
    must(!context.lookup(name), `Identifier ${name} already declared`, at)
  }

  function mustHaveBeenFound(entity, name, at) {
    must(entity, `Identifier ${name} not declared`, at)
  }

  function mustBeAType(entity, at) {
    must(isType(entity), "Type expected", at)
  }

  function mustHaveBooleanType(e, at) {
    must(e.type === core.boolType, "Expected a boolean", at)
  }

  function mustHaveDecType(e, at) {
    must(e.type === core.decType, "Expected a number", at)
  }

  function mustHaveDecOrStringType(e, at) {
    must(e.type === core.decType || e.type === core.stringType, "Expected a number or string", at)
  }

  function mustHaveKdorDecOrStringType(e, at) {
    must(
      e.type === core.decType || e.type === core.stringType || e.type === core.kdType,
      "Expected a number, string, or KD",
      at
    )
  }

  function mustBothHaveTheSameType(e1, e2, at) {
    must(equivalent(e1.type, e2.type), "Operands do not have the same type", at)
  }

  function mustBeAssignable(e, { toType }, at) {
    const message = `Cannot assign a ${typeDescription(e.type)} to a ${typeDescription(toType)}`
    must(assignable(e.type, toType), message, at)
  }

  function isMutable(e) {
    return e?.kind === "Variable" && e.mutable
  }

  function mustBeMutable(e, at) {
    must(isMutable(e), "Cannot assign to immutable variable", at)
  }

  function mustBeInLoop(at) {
    must(context.inLoop, "Break can only appear in a loop", at)
  }

  function mustBeInAFunction(at) {
    must(context.function, "Return can only appear in a function", at)
  }

  function mustReturnNothing(at) {
    must(context.function?.type?.returnType === core.voidType, "Something should be returned", at)
  }

  function mustReturnSomething(at) {
    must(context.function?.type?.returnType !== core.voidType, "Cannot return a value from this function", at)
  }

  function mustHaveDistinctFields(recordType, at) {
    const names = recordType.fields.map(f => f.name)
    const set = new Set(names)
    must(set.size === names.length, "Fields must be distinct", at)
  }

  function mustHaveMember(recordType, field, at) {
    must(recordType.fields.some(f => f.name === field), "No such field", at)
  }

  function isCallable(e) {
    return e?.kind === "RecordType" || e?.type?.kind === "FunctionType"
  }

  function mustBeCallable(e, at) {
    must(isCallable(e), "Call of non-function or non-constructor", at)
  }

  function mustHaveCorrectArgumentCount(argCount, paramCount, at) {
    const message = `${paramCount} argument(s) required but ${argCount} passed`
    must(argCount === paramCount, message, at)
  }

  function makeLiteral(kind, value, type) {
    return { kind, value, type }
  }

  function makeBinary(op, left, right, at) {
    if (op === "or" || op === "and") {
      mustHaveBooleanType(left, at)
      mustHaveBooleanType(right, at)
      return core.binary(op, left, right, core.boolType)
    }
    if (op === "==" || op === "!=") {
      mustBothHaveTheSameType(left, right, at)
      return core.binary(op, left, right, core.boolType)
    }
    if (op === "<" || op === "<=" || op === ">" || op === ">=") {
      mustHaveKdorDecOrStringType(left, at)
      mustBothHaveTheSameType(left, right, at)
      return core.binary(op, left, right, core.boolType)
    }
    if (op === "+" || op === "-") {
      if (left.type === core.stringType) {
        must(op === "+", "Expected a number", at)
        mustBothHaveTheSameType(left, right, at)
        return core.binary(op, left, right, core.stringType)
      }
      if (left.type === core.kdType) {
        must(op === "+" || op === "-", "Expected a number", at)
        mustBothHaveTheSameType(left, right, at)
        return core.binary(op, left, right, core.kdType)
      }
      mustHaveDecType(left, at)
      mustBothHaveTheSameType(left, right, at)
      return core.binary(op, left, right, core.decType)
    }
    if (op === "*" || op === "/") {
      mustHaveDecType(left, at)
      mustBothHaveTheSameType(left, right, at)
      return core.binary(op, left, right, core.decType)
    }
    return core.binary(op, left, right, left.type)
  }

  function makeUnary(op, operand, at) {
    if (op === "-") {
      mustHaveDecType(operand, at)
      return core.unary(op, operand, core.decType)
    }
    if (op === "not") {
      mustHaveBooleanType(operand, at)
      return core.unary(op, operand, core.boolType)
    }
    return core.unary(op, operand, operand.type)
  }

  function recordType(name, fields) {
    return { kind: "RecordType", name, fields }
  }

  function field(access, name, type) {
    return { kind: "Field", access, name, type }
  }

  function recordConstructor(type, args) {
    return { kind: "RecordConstructor", callee: type, args, type }
  }

  function fieldAccess(object, name, type) {
    return { kind: "FieldAccess", object, field: name, type }
  }

  function functionCall(callee, args) {
    const returnType = callee.type.returnType
    return { kind: "FunctionCall", callee, args, type: returnType }
  }

  const builder = match.matcher.grammar.createSemantics().addOperation("rep", {
    Program(statements) {
      return core.program(statements.children.map(s => s.rep()))
    },

    Statement(stmt) {
      return stmt.rep()
    },

    SimpleStmt(stmt, _semi) {
      return stmt.rep()
    },

    VarDecl(mut, id, typeAnnOpt, _eq, exp) {
      const name = id.sourceString
      mustNotAlreadyBeDeclared(name, { at: id })
      const initializer = exp.rep()
      const mutable = mut.sourceString === "let"
      let declaredType = initializer.type
      if (typeAnnOpt.children.length) {
        declaredType = typeAnnOpt.child(0).rep()
        mustBeAssignable(initializer, { toType: declaredType }, { at: id })
      }
      const v = core.variable(name, mutable, declaredType)
      context.add(name, v)
      return core.variableDeclaration(v, initializer)
    },

    TypeAnn(_colon, type) {
      return type.rep()
    },

    FunDecl(_fun, id, params, returnTypeOpt, _colon, block, _end) {
      const name = id.sourceString
      mustNotAlreadyBeDeclared(name, { at: id })
      const ps = params.rep()
      const returnType = returnTypeOpt.children.length ? returnTypeOpt.child(0).rep() : core.voidType
      const type = core.functionType(ps.map(p => p.type), returnType)
      const f = core.fun(name, ps, null, type)
      context.add(name, f)
      context = context.newChildContext({ inLoop: false, function: f })
      for (const p of ps) {
        mustNotAlreadyBeDeclared(p.name ?? p.id ?? p.sourceString ?? "", { at: id })
      }
      f.body = block.rep()
      context = context.parent
      return core.functionDeclaration(f)
    },

    Params(_lparen, params, _rparen) {
      return params.asIteration().children.map(p => p.rep())
    },

    Param(id, _colon, type) {
      const p = core.param ? core.param(id.sourceString, type.rep()) : core.variable(id.sourceString, false, type.rep())
      const name = p.name ?? id.sourceString
      mustNotAlreadyBeDeclared(name, { at: id })
      context.add(name, p)
      return p
    },

    ReturnType(_arrow, type) {
      return type.rep()
    },

    WhileStmt(_while, test, _colon, block, _end) {
      const t = test.rep()
      mustHaveBooleanType(t, { at: test })
      context = context.newChildContext({ inLoop: true })
      const body = block.rep()
      context = context.parent
      return core.whileStatement(t, body)
    },

    IfStmt(_if, test, _colon, thenBlock, elsePartOpt, _end) {
      const t = test.rep()
      mustHaveBooleanType(t, { at: test })
      context = context.newChildContext()
      const thenB = thenBlock.rep()
      context = context.parent
      let elseB = []
      if (elsePartOpt.children.length) {
        context = context.newChildContext()
        elseB = elsePartOpt.child(0).rep()
        context = context.parent
      }
      return { kind: "IfStatement", test: t, thenBlock: thenB, elseBlock: elseB }
    },

    ElsePart(_else, _colon, block) {
      return block.rep()
    },

    MatchStmt(_match, exp, _colon, cases, _end) {
      const e = exp.rep()
      const cs = cases.children.map(c => c.rep(e))
      return { kind: "MatchStatement", exp: e, cases: cs }
    },

    Case(_case, pattern, _colon, block) {
      return subjectExp => {
        const p = pattern.rep(subjectExp)
        context = context.newChildContext()
        if (p?.kind === "BindingPattern") {
          const v = core.variable(p.name, false, subjectExp.type)
          context.add(p.name, v)
          p.entity = v
        }
        const b = block.rep()
        context = context.parent
        return { kind: "Case", pattern: p, block: b }
      }
    },

    Pattern(p) {
      return subjectExp => p.rep(subjectExp)
    },

    RecordDecl(_record, id, _lbrace, fields, _rbrace) {
      const name = id.sourceString
      mustNotAlreadyBeDeclared(name, { at: id })
      const rt = recordType(name, fields.children.map(f => f.rep()))
      mustHaveDistinctFields(rt, { at: id })
      context.add(name, rt)
      return { kind: "RecordDeclaration", type: rt }
    },

    FieldDecl(access, id, _colon, type, _semi) {
      return field(access.rep(), id.sourceString, type.rep())
    },

    Access(a) {
      return a.sourceString
    },

    Assignment(id, _eq, exp) {
      const name = id.sourceString
      const target = context.lookup(name)
      mustHaveBeenFound(target, name, { at: id })
      mustBeMutable(target, { at: id })
      const source = exp.rep()
      mustBeAssignable(source, { toType: target.type }, { at: id })
      return core.assignment(target, source)
    },

    ReturnStmt(_ret, expOpt) {
      mustBeInAFunction({ at: _ret })
      if (expOpt.children.length === 0) {
        mustReturnNothing({ at: _ret })
        return core.shortReturnStatement
      }
      mustReturnSomething({ at: _ret })
      const e = expOpt.child(0).rep()
      mustBeAssignable(e, { toType: context.function.type.returnType }, { at: expOpt.child(0) })
      return core.returnStatement(e)
    },

    BreakStmt(_break) {
      mustBeInLoop({ at: _break })
      return core.breakStatement
    },

    ShowStmt(_show, _lparen, exp, _rparen) {
      const e = exp.rep()
      return { kind: "ShowStatement", expression: e }
    },

    Block(statements) {
      return statements.children.map(s => s.rep())
    },

    Type(t) {
      return t.rep()
    },

    IntType(_) {
      return core.intType
    },
    BoolType(_) {
      return core.boolType
    },
    StringType(_) {
      return core.stringType
    },
    DecType(_) {
      return core.decType
    },
    KDType(_) {
      return core.kdType
    },
    VoidType(_) {
      return core.voidType
    },

    Exp(e) {
      return e.rep()
    },

    ExpOr(left, tails) {
      return tails.children.reduce((acc, t) => makeBinary("or", acc, t.rep(), { at: t }), left.rep())
    },
    OrTail(_or, right) {
      return right.rep()
    },

    ExpAnd(left, tails) {
      return tails.children.reduce((acc, t) => makeBinary("and", acc, t.rep(), { at: t }), left.rep())
    },
    AndTail(_and, right) {
      return right.rep()
    },

    ExpEq(left, tails) {
      return tails.children.reduce((acc, t) => {
        const { op, right } = t.rep()
        return makeBinary(op, acc, right, { at: t })
      }, left.rep())
    },
    EqTail(op, right) {
      return { op: op.sourceString, right: right.rep() }
    },

    ExpRel(left, tails) {
      return tails.children.reduce((acc, t) => {
        const { op, right } = t.rep()
        return makeBinary(op, acc, right, { at: t })
      }, left.rep())
    },
    RelTail(op, right) {
      return { op: op.sourceString, right: right.rep() }
    },

    ExpAdd(left, tails) {
      return tails.children.reduce((acc, t) => {
        const { op, right } = t.rep()
        return makeBinary(op, acc, right, { at: t })
      }, left.rep())
    },
    AddTail(op, right) {
      return { op: op.sourceString, right: right.rep() }
    },

    ExpMul(left, tails) {
      return tails.children.reduce((acc, t) => {
        const { op, right } = t.rep()
        return makeBinary(op, acc, right, { at: t })
      }, left.rep())
    },
    MulTail(op, right) {
      return { op: op.sourceString, right: right.rep() }
    },

    ExpUnary(ops, expr) {
      const operand = expr.rep()
      const opList = ops.children.map(o => o.rep())
      return opList.reduceRight((acc, op) => makeUnary(op, acc, { at: ops }), operand)
    },
    UnaryOp(op) {
      return op.sourceString
    },

    ExpPostfix(primary, postfixes) {
      return postfixes.children.reduce((acc, p) => {
        const pf = p.rep()
        if (pf.kind === "Call") {
          mustBeCallable(acc, { at: p })
          const args = pf.args
          if (acc.kind === "RecordType") {
            const fields = acc.fields
            mustHaveCorrectArgumentCount(args.length, fields.length, { at: p })
            for (let i = 0; i < args.length; i++) {
              mustBeAssignable(args[i], { toType: fields[i].type }, { at: p })
            }
            return recordConstructor(acc, args)
          }
          const targetTypes = acc.type.paramTypes ?? []
          mustHaveCorrectArgumentCount(args.length, targetTypes.length, { at: p })
          for (let i = 0; i < args.length; i++) {
            mustBeAssignable(args[i], { toType: targetTypes[i] }, { at: p })
          }
          return functionCall(acc, args)
        }
        if (pf.kind === "Field") {
          const objType = acc.type
          must(objType?.kind === "RecordType", "Expected a record", { at: p })
          mustHaveMember(objType, pf.name, { at: p })
          const f = objType.fields.find(x => x.name === pf.name)
          return fieldAccess(acc, pf.name, f.type)
        }
        return acc
      }, primary.rep())
    },

    Postfix(p) {
      return p.rep()
    },

    Call(_lparen, args, _rparen) {
      return { kind: "Call", args: args.asIteration().children.map(a => a.rep()) }
    },

    Field(_dot, id) {
      return { kind: "Field", name: id.sourceString }
    },

    Primary(p) {
      return p.rep()
    },

    ParenExp(_l, e, _r) {
      return e.rep()
    },

    true(_) {
      return makeLiteral("BooleanLiteral", true, core.boolType)
    },

    false(_) {
      return makeLiteral("BooleanLiteral", false, core.boolType)
    },

    number(_whole, _dotFracOpt) {
      return makeLiteral("NumberLiteral", Number(this.sourceString), core.decType)
    },

    string(_open, _chars, _close) {
      const raw = this.sourceString
      return makeLiteral("StringLiteral", raw.slice(1, -1), core.stringType)
    },

    id(_first, _rest) {
      const name = this.sourceString
      const entity = context.lookup(name)
      mustHaveBeenFound(entity, name, { at: this })
      return entity
    },

    MoneyCtor(c) {
      return c.rep()
    },

    KDCall(_kd, _l, n, _r) {
      const v = Number(n.sourceString)
      return makeLiteral("KDConstructor", v, core.kdType)
    },

    FilsCall(_fils, _l, digits, _r) {
      const v = Number(digits.sourceString)
      return makeLiteral("FilsConstructor", v, core.kdType)
    },

    MoneyLit(m) {
      return m.rep()
    },

    BuiltInDenom(d) {
      return makeLiteral("MoneyLiteral", d.sourceString, core.kdType)
    },

    KDWhole(_digits, _kd) {
      return makeLiteral("MoneyLiteral", this.sourceString, core.kdType)
    },

    FilsWhole(_digits, _fils) {
      return makeLiteral("MoneyLiteral", this.sourceString, core.kdType)
    },

    KDMixed(_kDigits, _kd, _fDigits, _fils) {
      return makeLiteral("MoneyLiteral", this.sourceString, core.kdType)
    },

    true(_) {
        return makeLiteral("BooleanLiteral", true, core.boolType)
      },
      
      false(_) {
        return makeLiteral("BooleanLiteral", false, core.boolType)
      },
      
      number(_whole, _dot, _frac) {
        return makeLiteral("NumberLiteral", Number(this.sourceString), core.decType)
      },
      
      string(_open, _chars, _close) {
        const raw = this.sourceString
        return makeLiteral("StringLiteral", raw.slice(1, -1), core.stringType)
      },
      
      id(_first, _rest) {
        const name = this.sourceString
        const entity = context.lookup(name)
        if (!entity) {
          throw new Error(`Identifier ${name} not declared`)
        }
        return core.variable(name, false, entity.type)
      },
    })
      
    return builder(match).rep()
}