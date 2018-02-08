const fs = require('fs')

const listContents = (err, files) => {
  if (err) {
    console.error(err)
  } else {
    for (const name of files) {
      console.log(name)
    }
  }
}

const srcDir = process.argv[2]
fs.readdir(srcDir, listContents)
