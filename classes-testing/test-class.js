const { ok, AssertionError } = require('assert')

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

console.log(`terse results: ${hope.terse()}`)
console.log(`verbose results:\n${hope.verbose()}`)
