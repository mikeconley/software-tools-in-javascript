let allArgs = process.argv.slice(2)
let withIndex = false
if (allArgs[0] === '-i') {
  allArgs = allArgs.slice(1)
  withIndex = true
}

for (const i in allArgs) {
  if (withIndex) {
    console.log(i, allArgs[i])
  } else {
    console.log(allArgs[i])
  }
}
