// Libraries
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const ToyLayoutEngine = require("../index.js");

// For now, all tests will assume that we're laying out into a terminal
// with the following dimensions.
const Config = {
  cols: 80,
  lines: 50,
};

// Run through the .html files in this directory, find the matching expected
// .txt output, run the HTML string through the library and compare against
// the expectation.
describe("Reference test suite", () => {
  // First, scan through this directory looking for .html files...
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith(".html"));

  for (let file of files) {
    const inputFilePath = path.join(__dirname, file);
    const input = fs.readFileSync(inputFilePath, "utf-8");

    const basename = path.basename(file, ".html");
    const expectedFilePath = path.join(__dirname, `${basename}.txt`);
    const expected = fs.readFileSync(expectedFilePath, "utf-8");

    describe(`Testing ${file}`, () => {
      it(`It should match the associated reference file`, () => {
        const output = ToyLayoutEngine.layout(input, Config);
        assert.equal(output, expected);
      });
    });
  }
});

