export function program(statements) {
    return { kind: "Program", statements }
  }
  
  export function variableDeclaration(variable, initializer) {
    return { kind: "VariableDeclaration", variable, initializer }
  }
  
  export function variable(name, mutable, type) {
    return { kind: "Variable", name, mutable, type }
  }
  
  export const boolType = "Bool"
  export const intType = "Int"
  export const stringType = "String"
  export const decType = "Dec"
  export const kdType = "KD"
  export const voidType = "Void"
  export const anyType = "Any"
  
  export function functionType(paramTypes, returnType) {
    return { kind: "FunctionType", paramTypes, returnType }
  }
  
  export function functionDeclaration(fun) {
    return { kind: "FunctionDeclaration", fun }
  }
  
  export function fun(name, params, body, type) {
    return { kind: "Function", name, params, body, type }
  }
  
  export function intrinsicFunction(name, type) {
    return { kind: "Function", name, type, intrinsic: true }
  }
  
  export function param(name, type) {
    return { kind: "Param", name, type }
  }
  
  export function assignment(target, source) {
    return { kind: "Assignment", target, source }
  }
  
  export const breakStatement = { kind: "BreakStatement" }
  
  export function returnStatement(expression) {
    return { kind: "ReturnStatement", expression }
  }
  
  export const shortReturnStatement = { kind: "ShortReturnStatement" }
  
  export function whileStatement(test, body) {
    return { kind: "WhileStatement", test, body }
  }
  
  export function binary(op, left, right, type) {
    return { kind: "BinaryExpression", op, left, right, type }
  }
  
  export function unary(op, operand, type) {
    return { kind: "UnaryExpression", op, operand, type }
  }
  
  export function functionCall(callee, args) {
    if (callee.intrinsic) {
      if (callee.type.returnType === voidType) {
        return { kind: callee.name.replace(/^\p{L}/u, c => c.toUpperCase()), args }
      } else if (callee.type.paramTypes.length === 1) {
        return unary(callee.name, args[0], callee.type.returnType)
      } else {
        return binary(callee.name, args[0], args[1], callee.type.returnType)
      }
    }
    return { kind: "FunctionCall", callee, args, type: callee.type.returnType }
  }
  
  const anyToVoidType = functionType([anyType], voidType)
  const decToKDType = functionType([decType], kdType)
  const intToKDType = functionType([intType], kdType)
  
  export const standardLibrary = Object.freeze({
    Bool: boolType,
    Int: intType,
    String: stringType,
    Dec: decType,
    KD: kdType,
    Void: voidType,
    Any: anyType,
    show: intrinsicFunction("show", anyToVoidType),
    kd: intrinsicFunction("kd", decToKDType),
    fils: intrinsicFunction("fils", intToKDType),
  })
  
  String.prototype.type = stringType
  Number.prototype.type = decType
  Boolean.prototype.type = boolType
  