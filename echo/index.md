# Echo

Show how to echo command-line arguments as a way of introducing core features of ES6 JavaScript.

This shows:

- How to get command-line arguments.
- How to work with lists and loops.

---

- Will want to pass arguments to programs on the command line
- Build utility to print those arguments
  - Call it `echo` because that's the name of the Unix command-line program
  - Should be ashamed of ourselves for relying on implicit knowledge, and will try to do better in future

```js {title=print-argv-all.js}
console.log(process.argv)
```

- Node creates an object called `process` to give a running program information about itself
- `process.argv` is an array of all the command-line arguments
  - `argv` stands for "argument values", and is inherited from the early days of C programming
  - Implicit knowledge again, but not our fault

```input
$ node print-argv-all.js first second third
```
```output
[ '/node/bin/node',
  '/stj/src/echo-args/print-argv-all.js',
  'first',
  'second',
  'third' ]
```

1. The full path to the Node interpreter
2. The full path to the script
3. The user-supplied arguments

- What happens if we give arguments to Node itself?

```input
$ node --no-warnings print-argv-all.js first second third
```
```output
[ '/node/bin/node',
  '/stj/src/echo-args/print-argv-all.js',
  'first',
  'second',
  'third' ]
```

- Arguments to the interpreter don't show up in `process.argv`
  - So location of *our* arguments is predictable

- What if we just want to print our arguments?

```js {title=print-argv-user.js}
console.log(process.argv.slice(2))
```
```input
$ node print-argv-user.js first second third
```
```output
[ 'first', 'second', 'third' ]
```

- Array's `slice` method creates a new array containing part of the contents of the old
  - `array.slice(start)`: from `start` to the end
  - `array.slice(start, end)`: `start` up to but not including `end`
- JavaScript uses zero-based indexing
  - See [this post from Mike Hoye](<%= site.links.citation_needed %>) for the real reason
- Node pretty-prints arrays

- Now want to print one command-line argument per line
  - Which is a special case of printing one array element per line
- Use a `for` loop
  - Use the *right kind* of `for` loop

```js {title=for-of-classic.js}
const allArgs = process.argv.slice(2);
for (const arg of allArgs) {
  console.log(arg);
}
```
```input
$ node for-of.js first second third
```
```output
first
second
third
```

- `const` introduces the definition of a constant
  - Strongly prefer constants over variables because they are easier to reason about
  - Confusingly, often use the term "variables" to mean "constants and actually-variable variables"
- Use `=` to assign a value to a name
  - Types are associated with values, not with names
- Cannot call the variable `arguments`
  - That has a special meaning in JavaScript
- Define a second "constant" in the loop
  - The value of `arg` is re-set each time through the loop, but cannot be changed inside the loop
- Notice that the loop is `for`…`of`
  - Loop variable gets each value from the array, in order
  - See, we just used variable when referring to a constant

- Semi-colons are optional in modern JavaScript
  - Most programmers leave them out
  - But that does confuse some older editors that rely on them for indentation and highlighting

```js {title=for-of-modern.js}
const allArgs = process.argv.slice(2)
for (const arg of allArgs) {
  console.log(arg)
}
```

- A `for`…`of` loop takes the values from the array
- A `for`…`in` loop takes the *indices* of the array
  - Which is awful user experience (very easy to miss when reading)
  - And is inconsistent with Python and other languages

```js {title=for-in.js}
const allArgs = process.argv.slice(2)
for (const arg in allArgs) {
  console.log(arg)
}
```
```input
$ node for-in.js first second third
```
```output
0
1
2
```

- What if we want to optionally print the arguments' indices?
  - If the first argument is `-i`, include the index
  - Otherwise, just print the arguments
- Argument handling
  - Set up defaults
  - Then change using `if`
- Use `if` with condition in loop to print variations
- Use `===` to test equality (FIXME: explain)

```js {title=optional-index-in-loop.js}
let allArgs = process.argv.slice(2)
let withIndex = false
if (allArgs[0] === '-i') {
  allArgs = allArgs.slice(1)
  withIndex = true
}

for (const i in allArgs) {
  if (withIndex) {
    console.log(i, allArgs[i])
  } else {
    console.log(allArgs[i])
  }
}
```
```input
$ node for-optional-index-in-loop.js first second third
```
```output
first
second
third
```
```input
$ node for-optional-index-in-loop.js -i first second third
```
```output
0 'first'
1 'second'
2 'third'
```

- FIXME: explain the quotes

- Let's define functions to print things

```js {title=optional-define-functions.js}
function plain (values, index) {
  console.log(values[index])
}

function pretty (values, index) {
  console.log(index, values[index])
}

…set allArgs and withIndex as before…

for (const i in allArgs) {
  if (withIndex) {
    pretty(allArgs, i)
  } else {
    plain(allArgs, i)
  }
}
```

- Why bother?
- Because a function is just another chunk of data
- Which means we can assign it to a variable

```js {title=optional-assign-function-classic.js}
…define plain and pretty as before…

let allArgs = process.argv.slice(2)
let printer = plain
if (allArgs[0] === '-i') {
  allArgs = allArgs.slice(1)
  printer = pretty
}

for (const i in allArgs) {
  printer(allArgs, i)
}
```

- This becomes clearer if we use modern notation for defining the functions

```js {title=optional-assign-function-modern.js}
const plain = (values, index) => {
  console.log(values[index])
}

const pretty = (values, index) => {
  console.log(index, values[index])
}

let allArgs = process.argv.slice(2)
let printer = plain
if (allArgs[0] === '-i') {
  allArgs = allArgs.slice(1)
  printer = pretty
}

for (const i in allArgs) {
  printer(allArgs, i)
}
```

- This is called **fat arrow notation**
  - Makes it clearer that we're assigning a function definition to a variable
  - Behavior is more consistent with that of functions in other languages
    - Functions defined with `function` have some odd characteristics if you're used to other languages
  - Makes it easy to create small functions when we need them

- For example, let's use `forEach`

```js {title=optional-foreach-with-definition.js}
const plain = (value, index) => {
  console.log(value)
}

const pretty = (value, index) => {
  console.log(index, value)
}

let allArgs = process.argv.slice(2)
let printer = plain
if (allArgs[0] === '-i') {
  allArgs = allArgs.slice(1)
  printer = pretty
}

allArgs.forEach(printer)
```

- And then fold into the conditional

```js {title=optional-foreach-inline.js}
let allArgs = process.argv.slice(2)
if (allArgs[0] === '-i') {
  allArgs.slice(1).forEach((value, index) => { console.log(index, value) })
} else {
  allArgs.forEach((value, index) => { console.log(value) })
}
```
