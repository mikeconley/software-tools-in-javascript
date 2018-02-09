const minimist = require('minimist')
const glob = require('glob')
const hope = require('./hope')
const { AssertionError } = require('assert')

const DEFAULTS = {
  root: '.',
  output: 'terse',
}

STATUS  = ['pass', 'fail', 'error']

const hopeful = (args) => {
  const options = parse(args)
  glob.sync(`${options.root}/**/test-*.js`).forEach(f => {
    require(f)
  })
  const results = hope.getTests().map(t => run(t))
  let classified = {}
  for (status of STATUS) {
    classified[status] = results.filter(r => r.status === status)
  }
  if (options.output === 'terse') {
    terse(classified, console.log)
  } else if (options.output === 'verbose') {
    verbose(classified, console.log)
  } else {
    result = `Unrecognized output option ${options.output}`
  }
}

const parse = (args) => {
  const options = Object.assign({}, DEFAULTS)
  const argv = minimist(args)
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

const run = ({calledBy, comment, callback}) => {
  let status
  try {
    callback()
    status = 'pass'
  } catch (e) {
    if (e instanceof AssertionError) {
      status = 'fail'
    } else {
      status = 'error'
    }
  }
  return {status, calledBy, comment}
}

const terse = (results, display) => {
  display(STATUS.map(s => `${s}: ${results[s].length}`).join(' '))
}

const verbose = (results, display) => {
  let report = ''
  let prefix = ''
  for (const status of STATUS) {
    report += `${prefix}${status}:`
    prefix = '\n'
    for (const {_, calledBy, comment} of results[status]) {
      report += `${prefix}  ${calledBy} :: ${comment}`
    }
  }
  display(report)
}

hopeful(process.argv.slice(2))
