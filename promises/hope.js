const caller = require('caller')

class Hope {
  constructor () {
    this.tests = []
  }

  test (comment, callback) {
    const calledBy = caller()
    this.tests.push({calledBy, comment, callback})
  }

  getTests () {
    return this.tests
  }
}

module.exports = new Hope()
