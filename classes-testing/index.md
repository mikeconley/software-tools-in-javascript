# Class-Based Testing

1.  Introduce classes as a way to structure information.
2.  Show how to build a simple unit testing framework.

This shows:

-   The tools we will use through the rest of the book.
-   Gives us machinery to use for building and testing promises.

---

- FIXME: need to have introduced exceptions before here

- An **object** is a collection of key/value pairs
  - Keys do not have to be strings, but almost always are
  - Values can be anything
- Create an object by putting key/value pairs in curly brackets

```js {title=config-object.js}
const config = {
  'name': 'software-tools-in-javascript',
  'version': '0.0.1',
  'description': 'Software Tools in JavaScript',
  'author': 'The Software Tools Tendency'
}
```

- Can always get a value using `object[key]`

```js {title=config-object.js}
console.log(config['description'])
```
```output
Software Tools in JavaScript
```

- If the key is a simple name without any special characters, can use `object.key` instead

```js {title=config-object.js}
console.log(config.name)
```
```output
stj
```

- The square bracket form can be used with variables for keys
  - Dotted notation cannot

```js {title=config-object.js}
for (const key of ['author', 'version']) {
  console.log(key, config[key])
}
```
```output
author The Software Tools Tendency
version 0.0.1
```

- Can write keys without quotes
  - In which case they are stored as strings

```js {title=config-unquoted.js}
const config = {
  name: 'software-tools-in-javascript',
  version: '0.0.1',
  description: 'Software Tools in JavaScript',
  author: 'The Software Tools Tendency'
}
```

- Objects may contain arrays and other objects

```js {title=config-nested.js}
const config = {
  name: 'software-tools-in-javascript',
  version: '0.0.1',
  description: 'Software Tools in JavaScript',
  author: 'The Software Tools Tendency',
  keywords: ['lesson', 'JavaScript', 'software tools'],
  'repository': {
    'type': 'git',
    'url': 'git+https://github.com/software-tools-in-javascript/software-tools-in-javascript.git'
  }
}

for (const key in config) {
  console.log(key, config[key])
}
```
```output
name stj
version 0.0.1
description Software Tools in JavaScript
author The Software Tools Tendency
keywords [ 'lesson', 'JavaScript', 'software tools' ]
repository { type: 'git', url: 'git+https://github.com/software-tools-in-javascript/software-tools-in-javascript.git' }
```

- Note that the loop is `for`…`in` to get the keys, rather than `for`…`of` to get the values

- FIXME: introduce the need for unit testing functions

- We're going to want more specific checks, so import `ok` from `assert`
  - Use destructuring assignment

```js {title=test-list.js}
const { ok } = require('assert')
```

- Write a function that contains a bug
  - Should say the sign of 0 is 0

```js {title=test-list.js}
const sign = (value) => {
  if (value < 0) {
    return -1
  } else {
    return 1
  }
}
```

- Write some tests

```js {title=test-list.js}
const testNegative = () => ok(sign(-3) === -1, 'Sign of negative')
const testZero = () => ok(sign(0) === 0, 'Sign of zero')
const testPositive = () => ok(sign(19) === 1, 'Sign of positive')
const testError = () => ok(sgn(1) === 1, 'Mis-spelled sign')
```

- The last one is as important as the first three
  - False positives are the worst possible outcome

- Count three possible outcomes
  - How many tests passed
  - How many failed in the expected way
  - How many failed in unexpected ways (i.e., the test itself is broken)

```js {title=test-list.js}
const counts = {
  pass: 0,
  fail: 0,
  error: 0
}
```

- Now run the tests

```js {title=test-list.js}
for (const test of [testNegative, testZero, testPositive, testError]) {
  try {
    test()
    counts.pass += 1
  } catch (e) {
    if (e instanceof AssertionError) {
      counts.fail += 1
    } else {
      counts.error += 1
    }
  }
}
```

- Run the test function
- If we get to the next line, the test passed
- Otherwise, look at the type of the error object
  - If it's an `AssertionError`, the test failed
  - If it's any other kind of error, something unexpected happened
- Go back and fixed the import

```js {title=test-list.js}
const { ok, AssertionError } = require('assert')
```

- For now, just report the results, not the specific tests

```js {title=test-list.js}
console.log('test results', counts)
```
```output
test results { pass: 2, fail: 1, error: 1 }
```

- Things this doesn't do:
  - Tell us which tests passed, failed, or had errors
  - Separate test functions from code being tested: our users aren't going to want to import our tests
  - Find tests automatically: if we have to list them, we'll miss some
- And while it's OK not to take advantage of all of JavaScript's features, we shouldn't write Python in JavaScript
  - Let's use callbacks

```js {title=test-callback.js}
const allHope = {
  tests: [],
  pass: [],
  fail: [],
  error: []
}
const hope = (comment, callback) => {
  allHope.tests.push([comment, callback])
}

hope('Sign of negative is -1', () => ok(sign(-3) === -1))
hope('Sign of zero is 0', () => ok(sign(0) === 0))
hope('Sign of positive is 1', () => ok(sign(19) === 1))
hope('Sign misspelled is error', () => ok(sgn(1) === 1))
```

- A single data structure to record everything
- Tests are recorded when they're named
  - And their names are descriptive comments
- The code to run these is almost identical to what we've seen before

```js {title=test-callback.js}
allHope.tests.forEach(([comment, test]) => {
  try {
    test()
    allHope.pass.push(comment)
  } catch (e) {
    if (e instanceof AssertionError) {
      allHope.fail.push(comment)
    } else {
      allHope.error.push(comment)
    }
  }
})

console.log(`pass ${allHope.pass.length} fail ${allHope.fail.length} error ${allHope.error.length}`)
```

- Not just counting, but recording the names of the tests for later reporting
  - Note the use of destructuring in the parameter list of the `forEach` callback

- This is better, but we still have a global variable `allHope` being manipulated by a disconnected function `hope`
  - We probably should have put the `forEach` in a function as well
- We need a better way to build **components**

- Functions are just another kind of data
  - So objects can carry functions around with them

- FIXME: use a relevant example here instead of geometric shapes

```js {title=square-object.js}
const square = {
  name: 'square',
  size: 5,
  area: (it) => { return it.size * it.size },
  perimeter: (it) => { return 4 * it.size }
}
```

- Have to pass the object itself into the function

```js {title=square-object.js}
const a = square.area(square)
console.log(`area of square is ${a}`)
```
```output
area of square is 25
```

- This seems like a lot of work
- But it allows us to handle many different kinds of things in the same way

```js {title=square-object.js}
const circle = {
  name: 'circle',
  radius: 3,
  area: (it) => { return Math.PI * it.radius * it.radius },
  perimeter: (it) => { return 2 * Math.PI * it.radius }
}

const everything = [square, circle]
for (const thing of everything) {
  const a = thing.area(thing)
  const p = thing.perimeter(thing)
  console.log(`${thing.name}: area ${a} perimeter ${p}`)
}
```
```output
square: area 25 perimeter 20
circle: area 28.274333882308138 perimeter 18.84955592153876
```

- As long as we only use the value `name` and the functions `area` and `perimeter`
  we don't need to know what kind of thing we're actually working with
- **Polymorphism**

- But:
  - Building every object by hand is painful
  - Calling `thing.function(thing)` is clumsy
  - We usually want lots of objects with the same behaviors but different values

- JavaScript originally solved these problems using **prototypes**
  - Which turned out to be clumsy and confusing
  - But are still there under the hood
- Most object-oriented languages use **classes**
  - These have been added to JavaScript ES6
  - We will only use them

```js {title=square-class.js}
class Square {
  constructor (size) {
    this.name = 'square'
    this.size = size
  }
  area () { return this.size * this.size }
  perimeter () { return 4 * this.size }
}

const sq = Square(3)
console.log(`sq name ${sq.name} and area ${sq.area()}`)
```
```output
sq name square and area 9
```

- `new ClassName(…)`:
  - Creates a new blank object
  - Inserts a (hidden) reference to the object's class, so that the object can find its methods
  - Calls `constructor` to initialize the object's state
  - Class names are written in CamelCase by convention
- `this` is a pronoun that refers to a single specific object
- Methods are defined with a different syntax than the fat arrows we have been using
  - Wasn't any legacy syntax to work around
- Again, supports polymorphism

```js {title=square-class.js}
class Circle {
  constructor (radius) {
    this.name = 'circle'
    this.radius = radius
  }
  area () { return Math.PI * this.radius * this.radius }
  perimeter () { return 2 * Math.PI * this.radius }
}

const everything = [
  new Square(3.5),
  new Circle(2.5)
]
for (const thing of everything) {
  const a = thing.area(thing)
  const p = thing.perimeter(thing)
  console.log(`${thing.name}: area ${a} perimeter ${p}`)
}
```
```output
square: area 12.25 perimeter 14
circle: area 19.634954084936208 perimeter 15.707963267948966
rectangle: area 0.75 perimeter 4
```

- Now turn previous testing machinery inside out and put functions (methods) inside the class

```js {title=test-class.js}
class Hope {
  constructor () {
    this.tests = []
    this.pass = []
    this.fail = []
    this.error = []
  }

  test (comment, callback) {
    this.tests.push([comment, callback])
  }

  run () {
    this.tests.forEach(([comment, test]) => {
      try {
        test()
        this.pass.push(comment)
      } catch (e) {
        if (e instanceof AssertionError) {
          this.fail.push(comment)
        } else {
          this.error.push(comment)
        }
      }
    })
  }
}

const hope = new Hope()

const sign = (value) => {
  if (value < 0) {
    return -1
  } else {
    return 1
  }
}

hope.test('Sign of negative is -1', () => ok(sign(-3) === -1))
hope.test('Sign of zero is 0', () => ok(sign(0) === 0))
hope.test('Sign of positive is 1', () => ok(sign(19) === 1))
hope.test('Sign misspelled is error', () => ok(sgn(1) === 1))

hope.run()
```

- A little more verbose: `hope.test(…)` instead of just `hope(…)`
- But that is a small price to pay for something that is easier to re-use

- Better add some reporting methods

```js {title=test-class.js}
class Hope {

  …other methods…

  terse () {
    return `pass: ${this.pass.length} fail: ${this.fail.length} error: ${this.error.length}`
  }

  verbose () {
    let report = ''
    let prefix = ''
    for (const [title, results] of [['pass', this.pass], ['fail', this.fail], ['error', this.error]]) {
      report += `${prefix}${title}:`
      prefix = '\n'
      for (const r of results) {
        report += `${prefix}  ${r}`
      }
    }
    return report
  }
}
```

- And then:

```js {title=test-class.js}
hope.run()
console.log(`terse results: ${hope.terse()}`)
console.log(`verbose results:\n${hope.verbose()}`)
```
```output
terse results: pass: 2 fail: 1 error: 1
verbose results:
pass:
  Sign of negative is -1
  Sign of positive is 1
fail:
  Sign of zero is 0
error:
  Sign misspelled is error
```

- We can run a single file full of tests with `node filename`
- Useful to have a command-line tool to find and run all of our tests
  1. Rely on a naming convention to identify files with tests.
  2. Use `glob` to find them (we know how to do this).
  3. `require` them dynamically (and hope that they `hope` correctly)
  4. Then run all tests and report.

- Naming convention: `test-*.js`
  - Search below current directory if nothing else specified
  - Or below a named directory if a name is given
- Also want to control terse vs. verbose output
- Use the `minimist` library to parse command-line arguments
  - Name is definitely not obvious, but it's the top hit for a search

```js {title=parse-args.js}
const minimist = require('minimist')

const DEFAULTS = {
  root: '.',
  output: 'terse'
}

const hopeful = (args) => {
  const options = parse(args)
  console.log(options)
}

const parse = (args) => {
  const options = Object.assign({}, DEFAULTS)
  argv = minimist(args)
  for (const key in argv) {
    switch (key) {
    case 'd' :
      options.root = argv[key]
      break
    case 'v' :
      options.output = 'verbose'
      break
    case '_' :
      break
    default :
      console.error(`unrecognized option ${key}`)
      break
    }
  }
  return options
}

hopeful(process.argv.slice(2))
```

- Note use of `Object.assign` to copy an object
  - Often use `Object.assign({}, firstSet, secondSet)` as well
- And the `switch` statement
  - Its fall-through behavior is one of the curly brace family's biggest mistakes
  - *Always* use `break`
  - *Always* use explicit `default`
- Really should do something better than just report the unrecognized option and carry on…

- Dynamic loading
  - Try the simplest thing that could possibly work

```js {title=dynamic-require.js}
const path = process.argv[2]
const contents = require(path)
console.log(contents)
```

- First test case:

```js {title=without-export.js}
const hello = () => {
  console.log('hello')
}
```
```input
$ node dynamic-require.js ./without-export.js
```
```output
{}
```

- Have to assign to `module.exports`
  - Code is evaluated as it's loaded even without this


```js {title=with-export.js}
const hello = () => {
  console.log('hello')
}

module.exports = hello
```
```input
$ node dynamic-require.js ./without-export.js
```
```output
[Function: hello]
```

- Put the pieces together

```js {title=hopeful.js}
…imports…

const DEFAULTS = {
    …defaults…
}

const hopeful = (args) => {
  const options = parse(args)
  glob.sync(`${options.root}/**/test-*.js`).forEach(f => {
    require(f)
  })
  hope.run()
  let result
  if (options.output == 'terse') {
    result = hope.terse()
  } else if (options.output == 'verbose') {
    result = hope.verbose()
  } else {
    result = `Unrecognized output option ${options.output}`
  }
  console.log(result)
}

const parse = (args) => {
  …parse command-line arguments as before…
}

hopeful(process.argv.slice(2))
```

- Create a couple of files with tests
- Run
- It works
  - But we should probably add filenames to the test log
  - For the same reason that we modularize anything else
- Node has a `caller` module
  - `caller()` returns the name of the file containing the caller
  - Combining that with the string is a decent start
- Modify `hope`

```js {title=hope-caller.js}
const { AssertionError } = require('assert')
const caller = require('caller')

class Hope {
  …constructor…

  test (comment, callback) {
    const c = caller()
    this.tests.push([`${c}::${comment}`, callback])
  }

  …other methods stay the same…
}

module.exports = new Hope()
```

- Call it `hope-caller.js`
- Modify `hopeful.js` to create `hopeful-caller.j` that requires it
- Run it

```output
pass: 0 fail: 0 error: 0
```

- Because the `test-*.js` scripts are still loading `hope`, not `hope-caller`
  - Loading a library with a fixed name is just like using a magic number in code
  - Look at ways to fix this [later](FIXME-inversion)

- Once that's fixed, everything works

```output
pass:
  /stj/src/test-add-caller.js::Sum of 1 and 2
  /stj/src/test-sub-caller.js::Difference of 1 and 2
fail:
error:
```
