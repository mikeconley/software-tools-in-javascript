# Promises

Build promises from the ground up so that readers will understand how they work.

---

- FIXME: explain execution queue <https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/>

- Most functions execute in order

```js {title=not-callbacks-alone.js}
[1000, 1500, 500].forEach(t => {
  console.log(t)
})
```
```output
1000
1500
500
```

- A handful of built-in functions delay execution
  - `setTimeout` is probably the most widely used

```js {title=callbacks-with-timeouts.js}
[1000, 1500, 500].forEach(t => {
  console.log(`about to setTimeout for ${t}`)
  setTimeout(() => {console.log(`inside timer handler for ${t}`)}, t)
})
```
```output
about to setTimeout for 1000
about to setTimeout for 1500
about to setTimeout for 500
inside timer handler for 500
inside timer handler for 1000
inside timer handler for 1500
```

- Setting a timeout of zero has the effect of deferring execution without delay

```js {title=callbacks-with-zero-timeouts.js}
[1000, 1500, 500].forEach(t => {
  console.log(`about to setTimeout for ${t}`)
  setTimeout(() => {console.log(`inside timer handler for ${t}`)}, 0)
})
```
```output
about to setTimeout for 1000
about to setTimeout for 1500
about to setTimeout for 500
inside timer handler for 1000
inside timer handler for 1500
inside timer handler for 500
```

- We can use this to build a generic non-blocking function

```js {title=non-blocking.js}
const nonBlocking = (callback) => {
  setTimeout(callback, 0)
}

[1000, 1500, 500].forEach(t => {
  console.log(`about to do nonBlocking for ${t}`)
  nonBlocking(() => console.log(`inside callback for ${t}`))
})
```
```output
about to do nonBlocking for 1000
about to do nonBlocking for 1500
about to do nonBlocking for 500
inside callback for 1000
inside callback for 1500
inside callback for 500
```

- Why bother?
  - Because we may want to give something else a chance to run
- Node provides `setImmediate` to do this for us
  - And also `process.nextTick`, which doesn't do quite the same thing

```js {title=set-immediate.js}
[1000, 1500, 500].forEach(t => {
  console.log(`about to do setImmediate for ${t}`)
  setImmediate(() => console.log(`inside immediate handler for ${t}`))
})
```
```output
about to do nextTick for 1000
about to do nextTick for 1500
about to do nextTick for 500
inside timer handler for 1000
inside timer handler for 1500
inside timer handler for 500
```

- FIXME: explain `pledge.js` in detail
  - inspired by <https://levelup.gitconnected.com/understand-javascript-promises-by-building-a-promise-from-scratch-84c0fd855720>
- Need to explain purpose of `this.method.bind(this)`: can this be motivated earlier?

```js {title=pledge.js}
class Pledge {
  constructor (action) {
    this.actionCallbacks = []
    this.errorCallback = () => {}
    action(this.onResolve.bind(this), this.onReject.bind(this))
  }

  then (thenHandler) {
    this.actionCallbacks.push(thenHandler)
    return this
  }

  catch (errorHandler) {
    this.errorCallback = errorHandler
    return this
  }

  onResolve (value) {
    let storedValue = value
    try {
      this.actionCallbacks.forEach((action) => {
        storedValue = action(storedValue)
      })
    } catch (error) {
      this.actionCallbacks = []
      this.onReject(error)
    }
  }

  onReject (error) {
    this.errorCallback(error)
  }
}
```

- Successful usage

```js {title=pledge.js}
new Pledge((resolve, reject) => {
  console.log('1. top of action callback with double then and a catch')
  setTimeout(() => {
    console.log('1. about to call resolve callback')
    resolve('1. initial result')
    console.log('1. after resolve callback')
  }, 0)
  console.log('1. end of action callback')
}).then((value) => {
  console.log(`1. first then with "${value}"`)
  return '1. first then value'
}).then((value) => {
  console.log(`1. second then with "${value}" about to throw`)
  throw new Error(`1. exception from second then with "${value}"`)
}).catch((error) => {
  console.log(`1. in catch block with "${error}`)
})
```

- Immediately followed by an error case

```js {title=pledge.js}
new Pledge((resolve, reject) => {
  console.log('2. top of action callback with deliberate error')
  setTimeout(() => {
    console.log('2. about to reject on purpose')
    reject('2. error on purpose')
  }, 0)
}).then((value) => {
  console.log(`2. should not be here with "${value}"`)
}).catch((error) => {
  console.log(`2. in error handler with "${error}"`)
})
```

- Trace the output

```output
1. top of action callback with double then and a catch
1. end of action callback
2. top of action callback with deliberate error
1. about to call resolve callback
1. first then with "1. initial result"
1. second then with "1. first then value" about to throw
1. in catch block with "Error: 1. exception from second then with "1. first then value"
1. after resolve callback
2. about to reject on purpose
2. in error handler with "2. error on purpose"
```

- Use this to build `wc`
- Use the promisified version of `fs-extra`

```js {title=count-lines-single-file.js}
const fs = require('fs-extra-promise')

const filename = process.argv[2]

fs.readFileAsync(filename, {encoding: 'utf-8'})
  .then(data => {
    const length = data.split('\n').length - 1
    console.log(`${filename}: ${length}`)
  })
  .catch(err => {
    console.error(err.message)
  })
```
```input
$ node count-lines-single-file.js count-lines-single-file.js
```
```output
count-lines-single-file.js: 12
```

- And there's `glob-promise` as well

```js {title=count-lines-globbed-files.js}
const glob = require('glob-promise')
const fs = require('fs-extra-promise')

const main = (srcDir) => {
  glob(`${srcDir}/**/*.*`)
    .then(files => Promise.all(files.map(f => lineCount(f))))
    .then(counts => counts.forEach(c => console.log(c)))
    .catch(err => console.log(err.message))
}

const lineCount = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFileAsync(filename, {encoding: 'utf-8'})
      .then(data => resolve(data.split('\n').length-1))
      .catch(err => reject(err))
  })
}

const srcDir = process.argv[2]
main(srcDir)
```
```input
node count-lines-globbed-files.js .
```
```output
4
4
20
12
239
4
8
3
63
4
```

- Want filenames
- So construct temporary objects that have the information we need downstream
  - Use object with named fields instead of array with positional values

```js {title=count-lines-print-filenames.js}
const main = (srcDir) => {
  glob(`${srcDir}/**/*.*`)
    .then(files => Promise.all(files.map(f => lineCount(f))))
    .then(counts => counts.forEach(c => console.log(`${c.lines}: ${c.name}`)))
    .catch(err => console.log(err.message))
}

const lineCount = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFileAsync(filename, {encoding: 'utf-8'})
      .then(data => resolve({name: filename, lines: data.split('\n').length-1}))
      .catch(err => reject(err))
  })
}
```

- Works until we run into a directory with a name like `*.*`
  - Which we do in `node_modules`
- Need to use a `stat` call to check if something is a file or not
  - But `stat` returns a stats object that doesn't include the file's name
  - So we create a pair to pass down the chain
  - Use `{filename, stats}` to give the objects keys and values that match up

```js {title=count-lines-with-stat.js}
const main = (srcDir) => {
  glob(`${srcDir}/**/*.*`)
    .then(files => Promise.all(files.map(f => statPair(f))))
    .then(files => files.filter(pair => pair.stats.isFile()))
    .then(files => files.map(pair => pair.filename))
    .then(files => Promise.all(files.map(f => lineCount(f))))
    .then(counts => counts.forEach(c => console.log(`${c.lines}: ${c.name}`)))
    .catch(err => console.log(err.message))
}

const statPair = (filename) => {
  return new Promise((resolve, reject) => {
    fs.statAsync(filename)
      .then(stats => resolve({filename, stats}))
      .catch(error => reject(error))
  })
}

const lineCount = (filename) => {
  …as before…
}

const srcDir = process.argv[2]
main(srcDir)
```
```input
node count-lines-with-stat.js .
```
```output
4: ./callbacks-with-timeouts.js
4: ./callbacks-with-zero-timeouts.js
20: ./count-lines-globbed-files.js
20: ./count-lines-print-filenames.js
12: ./count-lines-single-file.js
31: ./count-lines-with-stat.js
278: ./index.md
4: ./next-tick.js
8: ./non-blocking.js
3: ./not-callbacks-alone.js
63: ./pledge.js
4: ./set-immediate.js
```

- Now make a histogram of how many files are of each length
  - Only look at `.js` files with the `glob`

```js {title=count-lines-histogram.js}
const main = (srcDir) => {
  glob(`${srcDir}/**/*.js`)
    .then(files => Promise.all(files.map(f => statPair(f))))
    .then(files => files.filter(pair => pair.stats.isFile()))
    .then(files => files.map(pair => pair.filename))
    .then(files => Promise.all(files.map(f => lineCount(f))))
    .then(counts => makeHistogram(counts))
    .then(histogram => display(histogram))
    .catch(err => console.log(err.message))
}

const statPair = (filename) => {
  …as before…
}

const lineCount = (filename) => {
  …as before…
}

const makeHistogram = (lengths) => {
  const largest = Math.max(...lengths)
  const bins = new Array(largest + 1).fill(0)
  lengths.forEach(n => { bins[n] += 1 })
  return bins
}

const display = (bins) => {
  bins.forEach((val, i) => console.log(`${i} ${val}`))
}

const srcDir = process.argv[2]
main(srcDir)
```

- Displays too many zeroes
- Modify to display only non-zero entries as an exercise
