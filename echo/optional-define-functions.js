function plain (values, index) {
  console.log(values[index])
}

function pretty (values, index) {
  console.log(index, values[index])
}

let allArgs = process.argv.slice(2)
let withIndex = false
if (allArgs[0] === '-i') {
  allArgs = allArgs.slice(1)
  withIndex = true
}

for (const i in allArgs) {
  if (withIndex) {
    pretty(allArgs, i)
  } else {
    plain(allArgs, i)
  }
}
