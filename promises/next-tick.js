[1000, 1500, 500].forEach(t => {
  console.log(`about to do nextTick for ${t}`)
  process.nextTick(() => console.log(`inside timer handler for ${t}`))
})
