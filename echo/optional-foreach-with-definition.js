const plain = (value, index) => {
  console.log(value)
}

const pretty = (value, index) => {
  console.log(index, value)
}

let allArgs = process.argv.slice(2)
let printer = plain
if (allArgs[0] === '-i') {
  allArgs = allArgs.slice(1)
  printer = pretty
}

allArgs.forEach(printer)
