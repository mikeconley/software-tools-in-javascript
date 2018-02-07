// Libraries
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Public interface
let ToyLayoutEngine = {
  layout(HTMLString, config) {
    const dom = new JSDOM(HTMLString);
    let output = "This is a placeholder! I think a lot of the work is going to go here.";

    return output;
  },
};

module.exports = ToyLayoutEngine;

