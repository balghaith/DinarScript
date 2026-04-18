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

### 1️⃣ Variables, final, Type Annotations, Assignment

<table>
<tr>
<th>DinarScript</th>
<th>Python</th>
<th>JavaScript</th>
</tr>
<tr>
<td valign="top">

<pre><code>let balance: Dec = 5;
final currencyName: String = "Dinar";
let accountOpen: Bool = true;

show(balance);
show(currencyName);
show(accountOpen);

balance = balance + 4;
show(balance);</code></pre>

</td>
<td valign="top">

<pre><code>balance = 5
currency_name = "Dinar"
account_open = True

print(balance)
print(currency_name)
print(account_open)

balance = balance + 4
print(balance)</code></pre>

</td>
<td valign="top">

<pre><code>let balance = 5
const currencyName = "Dinar"
let accountOpen = true

console.log(balance)
console.log(currencyName)
console.log(accountOpen)

balance = balance + 4
console.log(balance)</code></pre>

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

### 5️⃣ Function Without Explicit Return Type, Short Return

<table>
<tr>
<th>DinarScript</th>
<th>Python</th>
<th>JavaScript</th>
</tr>
<tr>
<td valign="top">

<pre><code>fun paymentAlert(amount: Dec):
  if amount == 3:
    show("special payment");
  end
  return;
end

if 3 == 3:
  show("special payment");
end</code></pre>

</td>
<td valign="top">

<pre><code>def payment_alert(amount: float):
    if amount == 3:
        print("special payment")
    return

if 3 == 3:
    print("special payment")</code></pre>

</td>
<td valign="top">

<pre><code>function paymentAlert(amount) {
  if (amount === 3) {
    console.log("special payment")
  }
  return
}

if (3 === 3) {
  console.log("special payment")
}</code></pre>

</td>
</tr>
</table>


### 🔎 More Examples

Many additional examples are available in the `examples/` folder.
