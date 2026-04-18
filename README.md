<p align="center">
  <img src="docs/dinarscript-logo.png" width="240">
</p>

# DinarScript

DinarScript is a programming language inspired by the Kuwaiti Dinar, designed to merge technical structure with identity. The project reimagines currency as code, turning a symbol of value into a language built on logic, syntax, and precision. It presents programming not only as engineering, but also as design.

---

## 🌐 Explore DinarScript Online

If the README feels too static, check out the interactive website for a more polished look at DinarScript.

🔗 **View the live project website:**  
https://balghaith.github.io/DinarScript

The site showcases the language vision, branding, design inspiration, and overall presentation.

---

## ✨ Language Features

### 🧠 Core Language Design
- Statically typed system
- Explicit type annotations
- Type-safe assignments
- Typed function parameters
- Typed return values
- Block scoping
- Clean structured syntax

### 📦 Variables & Memory
- Mutable variables with `let`
- Immutable constants with `final`
- Variable reassignment
- Identifier-based naming system

### 🔢 Built-in Types
- `Dec` numeric type
- `String` text type
- `Bool` boolean type
- `KD` money type
- `Void` return type

### ➕ Expressions & Operators
- Arithmetic: `+`, `-`, `*`, `/`
- Unary negative `-x`
- Parenthesized expressions `( )`
- Comparison: `==`, `!=`, `<`, `<=`, `>`, `>=`
- Boolean logic: `and`, `or`, `not`

### 🖥️ Output
- Built-in output statement `show()`

### 🔁 Control Flow
- `if` statements
- `if / else`
- Nested conditions
- `while` loops
- `break` statements

### ⚙️ Functions
- Function declarations with `fun`
- Parameterized functions
- Multiple parameters
- Function calls
- Nested function calls
- Return values
- Empty `return;`

### 🧩 Records / Data Modeling
- `record` declarations
- Custom structured types
- Multiple fields
- Field typing
- Dot notation field access

### 🎯 Pattern Matching
- `match` statements
- `case` branches
- Number matching
- String matching
- Boolean matching
- Money literal matching
- Wildcard `_`

### 📝 Strings
- String literals
- String concatenation
- Equality / inequality comparison
- Lexicographic comparisons

### 💰 Kuwaiti Money System (Signature Feature)
- Native `KD` currency type
- Literals: `1kd`, `5kd`, `10kd`, `20kd`
- Fractional literals: `1/4kd`, `1/2kd`
- Fils literals: `250fils`
- Mixed literals: `3kd250fils`
- Constructors: `kd()`, `fils()`
- Money comparisons
- Currency values inside records
- Currency pattern matching

## 🛡️ Static, Safety, and Security Checks

DinarScript uses compile-time analysis to detect errors before a program runs. By enforcing safety and correctness during compilation, the language reduces runtime failures and helps programmers catch mistakes early. This strengthens reliability and makes programs easier to reason about.

The compiler currently performs checks such as:
- preventing reassignment to immutable `final` variables
- detecting undeclared identifiers
- validating function argument counts
- validating function argument types
- preventing calls on non-function values
- ensuring non-`Void` functions return a value when required
- requiring Boolean conditions in `if` statements
- requiring Boolean conditions in `while` loops
- rejecting invalid unary operations
- rejecting invalid binary operations between incompatible types
- preventing duplicate field names in records
- detecting access to nonexistent record fields
- preventing field access on non-record values
- enforcing compatible pattern types in `match` statements
- preventing `break` statements outside loops

Together, these checks make DinarScript safer and more dependable by catching common programming errors during compilation instead of at runtime.

## ⚔️ Language Comparisons

### Naming Differences

| Feature | DinarScript | Python | JavaScript |
|--------|------------|--------|------------|
| Function Keyword | `fun` | `def` | `function` |
| Output | `show()` | `print()` | `console.log()` |
| Immutable Variable | `final` | N/A | `const` |
| Mutable Variable | `let` | standard assignment | `let` |
| Structured Types | `record` | `class` / dataclass | `class` |
| Block Closure | `end` | indentation | `{}` |
| Number Type | `Dec` | `int` / `float` | `number` |
| Boolean Type | `Bool` | `bool` | `boolean` |
| Void Return | `Void` | `None` | no explicit type |
| Pattern Matching | `match / case / end` | `match` | `switch` |

---

## 💻 Program Examples

### 1️⃣ Combined Showcase: Record, Field Access, Match, Money Pattern, String Result

<table>
<tr>
<th>DinarScript</th>
<th>Python</th>
<th>JavaScript</th>
</tr>
<tr>
<td valign="top">

<pre><code>record Product {
  public name: String;
  public price: KD;
}

let coffee = Product("Coffee", 2kd);
let tea = Product("Tea", 1kd);

show(coffee.price);

match coffee.price:
  case 1kd:
    show(coffee.name + " is regular");
  case _:
    show(coffee.name + " is premium");
end

show(tea.price);

match tea.price:
  case 1kd:
    show(tea.name + " is regular");
  case _:
    show(tea.name + " is premium");
end</code></pre>

</td>
<td valign="top">

<pre><code>class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

coffee = Product("Coffee", "2kd")
tea = Product("Tea", "1kd")

print(coffee.price)

match coffee.price:
    case "1kd":
        print(coffee.name + " is regular")
    case _:
        print(coffee.name + " is premium")

print(tea.price)

match tea.price:
    case "1kd":
        print(tea.name + " is regular")
    case _:
        print(tea.name + " is premium")</code></pre>

</td>
<td valign="top">

<pre><code>class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

const coffee = new Product("Coffee", "2kd");
const tea = new Product("Tea", "1kd");

console.log(coffee.price);

switch (coffee.price) {
  case "1kd":
    console.log(coffee.name + " is regular");
    break;
  default:
    console.log(coffee.name + " is premium");
}

console.log(tea.price);

switch (tea.price) {
  case "1kd":
    console.log(tea.name + " is regular");
    break;
  default:
    console.log(tea.name + " is premium");
}</code></pre>

</td>
</tr>
</table>

---

### 2️⃣ If / Else, Return Type, Function Without Return Type

<table>
<tr>
<th>DinarScript</th>
<th>Python</th>
<th>JavaScript</th>
</tr>
<tr>
<td valign="top">

<pre><code>fun paymentStatus(amount: Dec) -&gt; String:
  if amount &gt; 0:
    return "payment received";
  else:
    return "no payment";
  end
end

fun paymentAlert(amount: Dec):
  if amount == 3:
    show("special payment");
  end
end

show(paymentStatus(7));
show(paymentStatus(0));

if 3 == 3:
  show("special payment");
end</code></pre>

</td>
<td valign="top">

<pre><code>def payment_status(amount: float) -&gt; str:
    if amount &gt; 0:
        return "payment received"
    else:
        return "no payment"

def payment_alert(amount: float):
    if amount == 3:
        print("special payment")

print(payment_status(7))
print(payment_status(0))

if 3 == 3:
    print("special payment")</code></pre>

</td>
<td valign="top">

<pre><code>function paymentStatus(amount) {
  if (amount &gt; 0) {
    return "payment received"
  } else {
    return "no payment"
  }
}

function paymentAlert(amount) {
  if (amount === 3) {
    console.log("special payment")
  }
}

console.log(paymentStatus(7))
console.log(paymentStatus(0))

if (3 === 3) {
  console.log("special payment")
}</code></pre>

</td>
</tr>
</table>

---

### 3️⃣ While Loop, break, Reassignment

<table>
<tr>
<th>DinarScript</th>
<th>Python</th>
<th>JavaScript</th>
</tr>
<tr>
<td valign="top">

<pre><code>fun withdrawDown(start: Dec) -&gt; Void:
  let amount = start;
  while amount &gt;= 0:
    show(amount);
    if amount == 2:
      break;
    end
    amount = amount - 1;
  end
  return;
end

let amount = 5;
while amount &gt;= 0:
  show(amount);
  if amount == 2:
    break;
  end
  amount = amount - 1;
end</code></pre>

</td>
<td valign="top">

<pre><code>def withdraw_down(start: float) -&gt; None:
    amount = start
    while amount &gt;= 0:
        print(amount)
        if amount == 2:
            break
        amount = amount - 1
    return

amount = 5
while amount &gt;= 0:
    print(amount)
    if amount == 2:
        break
    amount = amount - 1</code></pre>

</td>
<td valign="top">

<pre><code>function withdrawDown(start) {
  let amount = start
  while (amount &gt;= 0) {
    console.log(amount)
    if (amount === 2) {
      break
    }
    amount = amount - 1
  }
  return
}

let amount = 5
while (amount &gt;= 0) {
  console.log(amount)
  if (amount === 2) {
    break
  }
  amount = amount - 1
}</code></pre>

</td>
</tr>
</table>

---

### 4️⃣ Records, Public / Private Fields, Record Construction, Field Access

<table>
<tr>
<th>DinarScript</th>
<th>Python</th>
<th>JavaScript</th>
</tr>
<tr>
<td valign="top">

<pre><code>record Customer {
  public name: String;
  public points: Dec;
  private cash: KD;
}

let customer = Customer("Bader", 22, 5kd);

show(customer.name);
show(customer.points);
show(customer.cash);</code></pre>

</td>
<td valign="top">

<pre><code>class Customer:
    def __init__(self, name: str, points: float, cash):
        self.name = name
        self.points = points
        self._cash = cash

customer = Customer("Bader", 22, "5kd")

print(customer.name)
print(customer.points)
print(customer._cash)</code></pre>

</td>
<td valign="top">

<pre><code>class Customer {
  constructor(name, points, cash) {
    this.name = name
    this.points = points
    this.cash = cash
  }
}

const customer = new Customer("Bader", 22, "5kd")

console.log(customer.name)
console.log(customer.points)
console.log(customer.cash)</code></pre>

</td>
</tr>
</table>

---

### 5️⃣ Match with False, True, Number, String, Money Literal, Wildcard

<table>
<tr>
<th>DinarScript</th>
<th>Python</th>
<th>JavaScript</th>
</tr>
<tr>
<td valign="top">

<pre><code>match true:
  case false:
    show("wallet closed");
  case true:
    show("wallet open");
end

match 2:
  case 1:
    show("small amount");
  case 2:
    show("medium amount");
end

match "cash":
  case "card":
    show("card payment");
  case "cash":
    show("cash payment");
end

match 1kd:
  case 500fils:
    show("half dinar");
  case 1kd:
    show("one dinar");
end

match "anything":
  case _:
    show("default payment case");
end</code></pre>

</td>
<td valign="top">

<pre><code>match True:
    case False:
        print("wallet closed")
    case True:
        print("wallet open")

match 2:
    case 1:
        print("small amount")
    case 2:
        print("medium amount")

match "cash":
    case "card":
        print("card payment")
    case "cash":
        print("cash payment")

match "1kd":
    case "500fils":
        print("half dinar")
    case "1kd":
        print("one dinar")

match "anything":
    case _:
        print("default payment case")</code></pre>

</td>
<td valign="top">

<pre><code>switch (true) {
  case false:
    console.log("wallet closed");
    break;
  case true:
    console.log("wallet open");
    break;
}

switch (2) {
  case 1:
    console.log("small amount");
    break;
  case 2:
    console.log("medium amount");
    break;
}

switch ("cash") {
  case "card":
    console.log("card payment");
    break;
  case "cash":
    console.log("cash payment");
    break;
}

switch ("1kd") {
  case "500fils":
    console.log("half dinar");
    break;
  case "1kd":
    console.log("one dinar");
    break;
}

switch ("anything") {
  default:
    console.log("default payment case");
}</code></pre>

</td>
</tr>
</table>

---

### 🔎 More Examples

Many additional examples are available in the `examples/` folder.

---

## 🙏 Acknowledgements

Special thanks to **Dr. Toal** for guidance throughout the project, and to **ChatGPT** for troubleshooting during development.
