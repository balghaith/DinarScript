import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { match } from "../src/parser.js"
import analyze from "../src/analyzer.js"
import optimize from "../src/optimizer.js"
import generate from "../src/generator.js"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
  {
    name: "small",
    source: `
      let x = 3 * 7;
      let y = true;
      y = (5 / -x) > -x or false;
      show((y and y) or false or (x*2) != 5);
    `,
    expected: dedent`
      let x_1 = (3 * 7);
      let y_2 = true;
      y_2 = (((5 / (-(x_1))) > (-(x_1))) || false);
      console.log((((y_2 && y_2) || false) || ((x_1 * 2) !== 5)));
    `,
  },
  {
    name: "if",
    source: `
      let x = 0;
      if x == 0:
        show("1");
      end
      if x == 0:
        show(1);
      else:
        show(2);
      end
    `,
    expected: dedent`
      let x_1 = 0;
      if ((x_1 === 0)) {
        console.log("1");
      }
      if ((x_1 === 0)) {
        console.log(1);
      } else {
        console.log(2);
      }
    `,
  },
  {
    name: "while",
    source: `
      let x = 0;
      while x < 2:
        show(x);
        x = x + 1;
      end
    `,
    expected: dedent`
      let x_1 = 0;
      while ((x_1 < 2)) {
        console.log(x_1);
        x_1 = (x_1 + 1);
      }
    `,
  },
  {
    name: "functions",
    source: `
      fun add(x: Dec, y: Dec) -> Dec:
        return x + y;
      end
      let z = add(2, 3);
      show(z);
    `,
    expected: dedent`
      function add_1(x_2, y_3) {
        return (x_2 + y_3);
      }
      let z_4 = add_1(2, 3);
      console.log(z_4);
    `,
  },
  {
    name: "records and fields",
    source: `
      record Person {
        public age: Dec;
        private name: String;
      }
      let p = Person(21, "bob");
      show(p.age);
    `,
    expected: dedent`
      class Person_1 {
        constructor(age_2, name_3) {
          this["age_2"] = age_2;
          this["name_3"] = name_3;
        }
      }
      let p_4 = new Person_1(21, "bob");
      console.log((p_4["age_2"]));
    `,
  },
  {
    name: "match",
    source: `
      match 1:
        case 1: show("one");
        case _: show("other");
      end
    `,
    expected: dedent`
      {
        const __match_1 = 1;
        if ((__match_1 === 1)) {
          console.log("one");
        } else {
          console.log("other");
        }
      }
    `,
  },
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const m = match(fixture.source)
      const actual = generate(optimize(analyze(m)))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})
  