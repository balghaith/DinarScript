const fs = require("fs");
const ohm = require("ohm-js");

const grammar = ohm.grammar(fs.readFileSync("src/dinarscript.ohm", "utf8"));

function match(source) {
  return grammar.match(source);
}

function parse(source) {
  const m = grammar.match(source);
  if (m.failed()) throw new Error(m.message);
  return m;
}

module.exports = { default: parse, match };
