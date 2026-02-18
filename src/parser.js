import fs from "fs"
import path from "path"
import * as ohm from "ohm-js"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const grammarSource = fs.readFileSync(path.join(__dirname, "dinarscript.ohm"), "utf-8")
export const grammar = ohm.grammar(grammarSource)

export function match(source) {
  return grammar.match(source)
}

export default match