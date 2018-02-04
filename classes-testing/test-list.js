const { ok, AssertionError } = require('assert')

const sign = (value) => {
    if (value < 0) {
        return -1
    }
    else {
        return 1
    }
}

const testNegative = () => ok(sign(-3) == -1, 'Sign of negative')
const testZero =     () => ok(sign(0) == 0, 'Sign of zero')
const testPositive = () => ok(sign(19) == 1, 'Sign of positive')
const testError =    () => ok(sgn(1) == 1, 'Mis-spelled sign')

const counts = {
    pass  : 0,
    fail  : 0,
    error : 0
}

for (const test of [testNegative, testZero, testPositive, testError]) {
    try {
        test()
        counts.pass += 1
    }
    catch (e) {
        if (e instanceof AssertionError) {
            counts.fail += 1
        }
        else {
            counts.error += 1
        }
    }
}

console.log('test results', counts)
