const { ok, AssertionError } = require('assert')

const allHope = {
    tests : [],
    pass  : [],
    fail  : [],
    error : []
}
const hope = (comment, callback) => {
    allHope.tests.push([comment, callback])
}

const sign = (value) => {
    if (value < 0) {
        return -1
    }
    else {
        return 1
    }
    return result
}

hope('Sign of negative is -1', () => ok(sign(-3) == -1))
hope('Sign of zero is 0', () => ok(sign(0) == 0))
hope('Sign of positive is 1', () => ok(sign(19) == 1))
hope('Sign misspelled is error', () => ok(sgn(1) == 1))

allHope.tests.forEach(([comment, test]) => {
    try {
        test()
        allHope.pass.push(comment)
    }
    catch (e) {
        if (e instanceof AssertionError) {
            allHope.fail.push(comment)
        }
        else {
            allHope.error.push(comment)
        }
    }
})

console.log(`pass ${allHope.pass.length} fail ${allHope.fail.length} error ${allHope.error.length}`)
