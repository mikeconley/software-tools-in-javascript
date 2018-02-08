const minimist = require('minimist')
const glob = require('glob')
const hope = require('./hope')

const DEFAULTS = {
  root: '.',
  output: 'terse'
}

const hopeful = (args) => {
  const options = parse(args)
  glob.sync(`${options.root}/**/test-*.js`).forEach(f => {
    require(f)
  })
  hope.run()
  let result
  if (options.output === 'terse') {
    result = hope.terse()
  } else if (options.output === 'verbose') {
    result = hope.verbose()
  } else {
    result = `Unrecognized output option ${options.output}`
  }
  console.log(result)
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

hopeful(process.argv.slice(2))
