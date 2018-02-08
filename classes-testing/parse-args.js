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
