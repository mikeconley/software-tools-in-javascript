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
    const calledBy = caller()
    this.tests.push({calledBy, comment, callback})
  }

  run () {
    this.tests.forEach(({calledBy, comment, callback}) => {
      try {
        callback()
        this.pass.push({calledBy, comment})
      } catch (e) {
        if (e instanceof AssertionError) {
          this.fail.push({calledBy, comment})
        } else {
          this.error.push({calledBy, comment})
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
        report += `${prefix}  ${r.calledBy} :: ${r.comment}`
      }
    }
    return report
  }
}

module.exports = new Hope()
