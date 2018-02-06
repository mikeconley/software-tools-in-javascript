const { AssertionError } = require('assert')
const caller = require('caller')

class Hope {
  constructor () {
    this.tests = []
    this.pass = []
    this.fail = []
    this.error = []
  }

  test (comment, callback) {
    const c = caller()
    this.tests.push([`${c}::${comment}`, callback])
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

module.exports = new Hope()
