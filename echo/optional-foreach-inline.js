let allArgs = process.argv.slice(2)
if (allArgs[0] === '-i') {
  allArgs.slice(1).forEach((value, index) => { console.log(index, value) })
} else {
  allArgs.forEach((value, index) => { console.log(value) })
}
