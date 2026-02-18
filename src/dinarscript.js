import { match } from "./parser.js"
import analyze from "./analyzer.js"

export function optimize(ast) {
  return ast
}

export function generate(ast) {
  return ast
}

export function compile(source) {
  const m = match(source)
  const ast = analyze(m)
  const optimized = optimize(ast)
  return generate(optimized)
}

export { match, analyze }
export default compile
