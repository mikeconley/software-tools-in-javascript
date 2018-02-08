const { ok } = require('assert')
const hope = require('./hope')

hope.test('Difference of 1 and 2', () => ok((1 - 2) === -1))
