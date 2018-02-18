// Libraries
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Public interface
let ToyLayoutEngine = {
  pushStackingContext(node, prefix, skipWhitespace) {
    this.stackingContext.push({node: node.lastChild, prefix, skipWhitespace});
  },
  currentStackingContext() {
    return this.stackingContext[this.stackingContext.length - 1];
  },
  updateStackingContext(node) {
    if (node.nodeName != '#text') {
      this.currentStackingContext().skipWhitespace = false;
    }
    if (this.currentStackingContext().node == node) {
      this.stackingContext.pop();
      this.currentStackingContext().skipWhitespace = true;
    }
  },

  handleHead(node, displayList) {
    // Nothing we need to do here.
  },
  handleTitle(node, displayList) {
    // Remove the previous text, because we're a block element.
    let spaces = this.config.cols - node.textContent.length - 1;
    this.pushStackingContext(node, ' '.repeat(spaces), true);
  },
  handleBody(node, displayList) {
    // Nothing we need to do here.
  },
  handleH1(node, displayList) {
    // Remove the previous whitespace, because we're a block element.
    let spaces = (this.config.cols - node.textContent.length) / 2;
    this.pushStackingContext(node, ' '.repeat(spaces), true);
    displayList.push('\n');
  },
  handleH2(node, displayList) {
    // Remove the previous text, because we're a block element.
    displayList.push('\n\n');
  },
  handleH3(node, displayList) {
    // Remove the previous text, because we're a block element.
    this.pushStackingContext(node, '  ', true);
    displayList.push('\n\n');
  },
  handleH4(node, displayList) {
    // Remove the previous text, because we're a block element.
    this.pushStackingContext(node, '    ', true);
    displayList.push('\n\n');
  },
  handleH5(node, displayList) {
    // Remove the previous text, because we're a block element.
    this.pushStackingContext(node, '      ', true);
    displayList.push('\n\n');
  },
  handleH6(node, displayList) {
    // Remove the previous text, because we're a block element.
    this.pushStackingContext(node, '        ', true);
    displayList.push('\n\n');
  },
  handleP(node, displayList) {
    this.pushStackingContext(node, '   ', true);
    displayList.push('\n\n');
  },
  handleUl(node, displayList) {
    displayList.push('\n');
    this.pushStackingContext(node, '     * ', true);
  },
  handleOl(node, displayList) {
    displayList.push('\n');
    this.pushStackingContext(node, '    1. ', true);
  },
  handleLi(node, displayList) {
    displayList.push('\n');
  },
  handleStrong(node, displayList) {
    console.log("STRONG is unimplemented");
  },
  handleBr(node, displayList) {
    displayList.push('\n');
  },
  handleCode(node, displayList) {
    console.log("CODE is unimplemented");
  },
  handleBlockquote(node, displayList) {
    console.log("BLOCKQUOTE is unimplemented");
  },
  handlePre(node, displayList) {
    console.log("PRE is unimplemented");
  },
  handleA(node, displayList) {
    console.log("A is unimplemented");
  },
  handleText(node, displayList) {
    if (this.currentStackingContext().skipWhitespace && node.textContent.trim() == "") {
      return;
    }
    displayList.push(this.currentStackingContext().prefix + node.textContent.trim());
  },

  layout(HTMLString, config) {
    this.config = config;
    this.stackingContext = [{node: null, prefix: '', skipWhitespace: true}];
    const document = new JSDOM(HTMLString).window.document;
    let displayList = [];
    let walker = document.createTreeWalker(document.documentElement, -1, null, false)
    while (walker.nextNode()){
      //Do something with the current node
      switch (walker.currentNode.nodeName) {
        case 'HEAD':
          this.handleHead(walker.currentNode, displayList);
          break;
        case 'TITLE':
          this.handleTitle(walker.currentNode, displayList);
          break;
        case 'BODY':
          this.handleBody(walker.currentNode, displayList);
          break;
        case 'H1':
          this.handleH1(walker.currentNode, displayList);
          break;
        case 'H2':
          this.handleH2(walker.currentNode, displayList);
          break;
        case 'H3':
          this.handleH3(walker.currentNode, displayList);
          break;
        case 'H4':
          this.handleH4(walker.currentNode, displayList);
          break;
        case 'H5':
          this.handleH5(walker.currentNode, displayList);
          break;
        case 'H6':
          this.handleH6(walker.currentNode, displayList);
          break;
        case 'P':
          this.handleP(walker.currentNode, displayList);
          break;
        case 'UL':
          this.handleUl(walker.currentNode, displayList);
          break;
        case 'OL':
          this.handleOl(walker.currentNode, displayList);
          break;
        case 'LI':
          this.handleLi(walker.currentNode, displayList);
          break;
        case 'STRONG':
          this.handleStrong(walker.currentNode, displayList);
          break;
        case 'BR':
          this.handleBr(walker.currentNode, displayList);
          break;
        case 'CODE':
          this.handleCode(walker.currentNode, displayList);
          break;
        case 'BLOCKQUOTE':
          this.handleBlockquote(walker.currentNode, displayList);
          break;
        case 'PRE':
          this.handlePre(walker.currentNode, displayList);
          break;
        case 'A':
          this.handleA(walker.currentNode, displayList);
          break;
        case '#text':
          this.handleText(walker.currentNode, displayList);
          break;
        default:
          console.log(`${walker.currentNode.nodeName} is unimplemented.`);
          break;
      }
      this.updateStackingContext(walker.currentNode);
    }
    let output = displayList.join('');

    return output;
  },
};

module.exports = ToyLayoutEngine;

const fs = require("fs");
console.log(ToyLayoutEngine.layout(fs.readFileSync('test/smoketest.html', "utf-8"), {
  cols: 80,
  lines: 50,
}));
