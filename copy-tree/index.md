# Copy Files Recursively

Show how file I/O and callbacks work by copying files recursively.

This shows:

-   How callbacks work.

---

- List the contents of a directory (the wrong way).

```js {title=list-dir-wrong.js}
const fs = require('fs')

const srcDir = process.argv[2]
const results = fs.readdir(srcDir)
for (const name of results) {
  console.log(name)
}
```

- Use `require(library-name)` to load a library
  - Returns an object
  - Assign that to a constant
    - Allows us to give short nicknames to meaningfully-named libraries
  - Use `library.component` to refer to things in the library

```input
$ node list-dir-wrong.js .
```
```error
```
for (const name of results) {
                 ^
TypeError: Cannot read property 'Symbol(Symbol.iterator)' of undefined
    at Object.<anonymous> (/Users/gvwilson/stj/copy-tree/list-dir-wrong.js:5:18)
    …
```

- `fs.readdir` doesn't return anything
- [Documentation](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback) says that it takes a **callback**
- FIXME: explain why Node uses callbacks so heavily

- Rewrite with an explicit function

```js {title=list-dir-function-defined.js}
const fs = require('fs')

const listContents = (err, files) => {
  if (err) {
    console.error(err)
  }
  else {
    for (const name of files) {
      console.log(name)
    }
  }
}

const srcDir = process.argv[2]
const results = fs.readdir(srcDir, listContents)
```

- Node callbacks always get an error (if any) as their first argument
  - Use `console.error` to report it for now
  - Do something more sensible once we understand exceptions
- The actual results are passed as the other argument (in this case, `files`)

```input
$ node list-dir-function-defined.js .
```
```output
index.md
list-dir-function-defined.js
list-dir-wrong.js
```

- More idiomatic to define the callback anonymously where it's used

```js {title=list-dir-function-anonymous.js}
const fs = require('fs')

const srcDir = process.argv[2]
const results = fs.readdir(srcDir, (err, files) => {
  if (err) {
    console.error(err)
  }
  else {
    for (const name of files) {
      console.log(name)
    }
  }
})
```

- So how do we get all the files to be copied?
- Use `glob`
  - Another old Unix name
  - [Documentation here](https://github.com/isaacs/node-glob)
- Start by getting all filenames
  - Works by name, not by type
  - So filenames that *don't* match `*.*` won't be detected

```js {title=glob-all-files.js}
const glob = require('glob')

glob('**/*.*', (err, files) => {
  if (err) {
    console.log(err)
  } else {
    for (const filename of files) {
      console.log(filename)
    }
  }
})
```
```input
$ node glob-all-files.js .
```
```output
glob-all-files.js
glob-all-files.js~
index.md
list-dir-function-anonymous.js
list-dir-function-anonymous.js~
list-dir-function-defined.js
list-dir-wrong.js
```

- Works - but (probably) don't want to copy Emacs backup files
- So we can:
  - Get the list and then filter those out
  - Have `glob` filter those for us
- First choice: get, then filter

```js {title=glob-get-then-filter-pedantic.js}
glob('**/*.*', (err, files) => {
  if (err) {
    console.log(err)
  } else {
    files = files.filter((f) => {return !f.endsWith('~')})
    for (const filename of files) {
      console.log(filename)
    }
  }
})
```
```output
glob-all-files.js
glob-get-then-filter-pedantic.js
index.md
list-dir-function-anonymous.js
list-dir-function-defined.js
list-dir-wrong.js
```

- `Array.filter` creates a new array containing all the items of the original that pass the test
- We can make this more idiomatic by:
  - Removing the parentheses around the single parameter
  - Writing a naked expression

```js {title=glob-get-then-filter-idiomatic.js}
glob('**/*.*', (err, files) => {
  if (err) {
    console.log(err)
  } else {
    files = files.filter(f => !f.endsWith('~'))
    for (const filename of files) {
      console.log(filename)
    }
  }
})
```

- Better just to have `glob` do it
  - Documentation says there's an `options` argument

```js {title=glob-filter-with-options.js}
glob('**/*.*', {ignore: '*~'}, (err, files) => {
  if (err) {
    console.log(err)
  } else {
    for (const filename of files) {
      console.log(filename)
    }
  }
})
```

- Now specify a source directory and fold that into the glob

```js {title=glob-with-source-directory.js}
const srcDir = process.argv[2]

glob(`${srcDir}/**/*.*`, {ignore: '*~'}, (err, files) => {
  if (err) {
    console.log(err)
  } else {
    for (const filename of files) {
      console.log(filename)
    }
  }
})
```

- This uses **string interpolation**
  - Back-quote the string
  - Use `${name}` to insert the value of an expression
  - This is completely separate from the globbing

- Now we know that the paths will start with
- So we can take a second argument that specifies an output directory

```js {title=glob-with-dest-directory.js}
const [srcDir, destDir] = process.argv.slice(2)

glob(`${srcDir}/**/*.*`, {ignore: '*~'}, (err, files) => {
  if (err) {
    console.log(err)
  } else {
    for (const srcName of files) {
      const destName = srcName.replace(srcDir, destDir)
      console.log(srcName, destName)
    }
  }
})
```

- This uses **destructuring assignment**
  - And only works if both source and destination are given on the command line

- Now ensure that the output directory exists

```js {title=glob-ensure-output-directory.js}
const glob = require('glob')
const fs = require('fs-extra')
const path = require('path')

const [srcRoot, destRoot] = process.argv.slice(2)

glob(`${srcRoot}/**/*.*`, {ignore: '*~'}, (err, files) => {
  if (err) {
    console.log(err)
  } else {
    for (const srcName of files) {
      const destName = srcName.replace(srcRoot, destRoot)
      const destDir = path.dirname(destName)
      fs.ensureDir(destDir, (err) => {
        if (err) {
          console.error(err)
        }
      })
    }
  }
})
```

- Use `fs-extra` instead of `fs` because it provides some useful utilities
- And use `path` to manipulate pathnames because someone else has figured out the string manipulation
- Gives us an empty tree of directories
- Note the name changes
  - Use `srcRoot` and `destRoot` because we're going to need `destDir`
  - Yes, this was a bug…

- And now we copy the files

```js {title=copy-file-unfiltered.js}
glob(`${srcRoot}/**/*.*`, {ignore: '*~'}, (err, files) => {
  if (err) {
    console.log(err)
  } else {
    for (const srcName of files) {
      const destName = srcName.replace(srcRoot, destRoot)
      const destDir = path.dirname(destName)
      fs.ensureDir(destDir, (err) => {
        if (err) {
          console.error(err)
        } else {
          fs.copy(srcName, destName, (err) => {
            if (err) {
              console.error(err)
            }
          })
        }
      })
    }
  }
})
```

- And it *almost* works

```input
$ mkdir /tmp/out
$ node glob-copy-file.js ../node_modules /tmp/out
```
```error
{ Error: ENOENT: no such file or directory, chmod '/tmp/out/fs.realpath/package.json'
    at Error (native)
  errno: -2,
  code: 'ENOENT',
  syscall: 'chmod',
  path: '/tmp/out/fs.realpath/package.json' }
```

- Because `fs.realpath` is a directory, not a file, but matches our `glob`

```js {title=copy-file-filtered.js}
glob(`${srcRoot}/**/*.*`, {ignore: '*~'}, (err, files) => {
  if (err) {
    console.log(err)
  } else {
    for (const srcName of files) {
      fs.stat(srcName, (err, stats) => {
        if (err) {
          console.error(err)
        } else if (stats.isFile()) {
          const destName = srcName.replace(srcRoot, destRoot)
          const destDir = path.dirname(destName)
          fs.ensureDir(destDir, (err) => {
            if (err) {
              console.error(err)
            } else {
              fs.copy(srcName, destName, (err) => {
                if (err) {
                  console.error(err)
                }
              })
            }
          })
        }
      })
    }
  }
})
```

- This works…
- …but four levels of asynchronous callbacks is hard to follow
- We need a better mechanism
