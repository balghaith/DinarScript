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
<th align="center">
<img src="docs/dinarscript-logo.png" width="22"><br>DinarScript
</th>
<th align="center">
<img src="docs/python.png" width="22"><br>Python
</th>
<th align="center">
<img src="docs/javascript.png" width="22"><br>JavaScript
</th>
</tr>
<tr>
<td valign="top"><pre><code>...</code></pre></td>
<td valign="top"><pre><code>...</code></pre></td>
<td valign="top"><pre><code>...</code></pre></td>
</tr>
</table>

---

### 2️⃣ If / Else, Return Type, Function Without Return Type

<table>
<tr>
<th align="center">
<img src="docs/dinarscript-logo.png" width="22"><br>DinarScript
</th>
<th align="center">
<img src="docs/python.png" width="22"><br>Python
</th>
<th align="center">
<img src="docs/javascript.png" width="22"><br>JavaScript
</th>
</tr>
<tr>
<td valign="top"><pre><code>...</code></pre></td>
<td valign="top"><pre><code>...</code></pre></td>
<td valign="top"><pre><code>...</code></pre></td>
</tr>
</table>

---

### 3️⃣ While Loop, break, Reassignment

<table>
<tr>
<th align="center">
<img src="docs/dinarscript-logo.png" width="22"><br>DinarScript
</th>
<th align="center">
<img src="docs/python.png" width="22"><br>Python
</th>
<th align="center">
<img src="docs/javascript.png" width="22"><br>JavaScript
</th>
</tr>
<tr>
<td valign="top"><pre><code>...</code></pre></td>
<td valign="top"><pre><code>...</code></pre></td>
<td valign="top"><pre><code>...</code></pre></td>
</tr>
</table>

---

### 4️⃣ Records, Public / Private Fields, Record Construction, Field Access

<table>
<tr>
<th align="center">
<img src="docs/dinarscript-logo.png" width="22"><br>DinarScript
</th>
<th align="center">
<img src="docs/python.png" width="22"><br>Python
</th>
<th align="center">
<img src="docs/javascript.png" width="22"><br>JavaScript
</th>
</tr>
<tr>
<td valign="top"><pre><code>...</code></pre></td>
<td valign="top"><pre><code>...</code></pre></td>
<td valign="top"><pre><code>...</code></pre></td>
</tr>
</table>

---

### 5️⃣ Function Without Explicit Return Type, Short Return

<table>
<tr>
<th align="center">
<img src="docs/dinarscript-logo.png" width="22"><br>DinarScript
</th>
<th align="center">
<img src="docs/python.png" width="22"><br>Python
</th>
<th align="center">
<img src="docs/javascript.png" width="22"><br>JavaScript
</th>
</tr>
<tr>
<td valign="top"><pre><code>...</code></pre></td>
<td valign="top"><pre><code>...</code></pre></td>
<td valign="top"><pre><code>...</code></pre></td>
</tr>
</table>

---

### 🔎 More Examples

Many additional examples are available in the `examples/` folder.
