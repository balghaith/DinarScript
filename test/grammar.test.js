const { default: parse, match } = require("../src/dinarscript.js");

test("parses a simple variable declaration", () => {
  expect(() => parse("let x: Int = 3;")).not.toThrow();
});

test("parses kd and fils constructors", () => {
  expect(() => parse("let a: KD = kd(10.000);")).not.toThrow();
  expect(() => parse("let b: KD = fils(250);")).not.toThrow();
});

test("parses while loop with show", () => {
  expect(() =>
    parse(`
      let i: Int = 0;
      let total: KD = kd(0.000);
      while i < 4:
        total = total + fils(250);
        show(total);
        i = i + 1;
      end
    `)
  ).not.toThrow();
});

test("rejects keyword as identifier", () => {
  expect(() => parse("let kd: Int = 3;")).toThrow();
  expect(() => parse("let show: Int = 1;")).toThrow();
});

test("rejects malformed syntax", () => {
  expect(() => parse("fun f(: end")).toThrow();
});

test("match succeeds on valid input", () => {
  expect(match("let x: Int = 3;").succeeded()).toBe(true);
});

test("parse throws on invalid input", () => {
  expect(() => parse("let x: Int = ;")).toThrow();
});

