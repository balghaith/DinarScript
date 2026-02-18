import { match } from "./parser.js"
import analyze from "./analyzer.js"
import optimize from "./optimizer.js"
import generate from "./generator.js"

export default function compile(source, outputType) {
  if (!["parsed", "analyzed", "optimized", "js"].includes(outputType)) {
    throw new Error("Unknown output type")
  }
  const m = match(source)
  if (!m.succeeded()) {
    throw new Error(m.message)
  }
  if (outputType === "parsed") return "Syntax is ok"
  const analyzed = analyze(m)
  if (outputType === "analyzed") return analyzed
  const optimized = optimize(analyzed)
  if (outputType === "optimized") return optimized
  return generate(optimized)
}