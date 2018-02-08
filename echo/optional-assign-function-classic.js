function plain (values, index) {
  console.log(values[index])
}

function pretty (values, index) {
  console.log(index, values[index])
}

let allArgs = process.argv.slice(2)
let printer = plain
if (allArgs[0] === '-i') {
  allArgs = allArgs.slice(1)
  printer = pretty
}

for (const i in allArgs) {
  printer(allArgs, i)
}
