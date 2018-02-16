// Libraries
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Public interface
let ToyLayoutEngine = {
  trimWhitespace(displayList) {
    while (displayList.length && displayList[displayList.length - 1].trim() == "") {
      displayList.pop();
    }
  },
  handleHead(node, displayList, config) {
    // Nothing we need to do here.
  },
  handleTitle(node, displayList, config) {
    // Remove the previous text, because we're a block element.
    this.trimWhitespace(displayList);
    let spaces = config.cols - node.textContent.length - 1;
    displayList.push(' '.repeat(spaces));
  },
  handleBody(node, displayList, config) {
    // Nothing we need to do here.
  },
  handleH1(node, displayList, config) {
    // Remove the previous whitespace, because we're a block element.
    this.trimWhitespace(displayList);
    let spaces = (config.cols - node.textContent.length) / 2;
    displayList.push('\n' + ' '.repeat(spaces));
  },
  handleH2(node, displayList, config) {
    // Remove the previous text, because we're a block element.
    this.trimWhitespace(displayList);
    displayList.push('\n\n');
  },
  handleH3(node, displayList, config) {
    // Remove the previous text, because we're a block element.
    this.trimWhitespace(displayList);
    displayList.push('\n\n  ');
  },
  handleH4(node, displayList, config) {
    // Remove the previous text, because we're a block element.
    this.trimWhitespace(displayList);
    displayList.push('\n\n    ');
  },
  handleH5(node, displayList, config) {
    // Remove the previous text, because we're a block element.
    this.trimWhitespace(displayList);
    displayList.push('\n\n      ');
  },
  handleH6(node, displayList, config) {
    // Remove the previous text, because we're a block element.
    this.trimWhitespace(displayList);
    displayList.push('\n\n        ');
  },
  handleP(node, displayList, config) {
    console.log("P is unimplemented");
  },
  handleUl(node, displayList, config) {
    console.log("UL is unimplemented");
  },
  handleOl(node, displayList, config) {
    console.log("OL is unimplemented");
  },
  handleLi(node, displayList, config) {
    console.log("LI is unimplemented");
  },
  handleStrong(node, displayList, config) {
    console.log("STRONG is unimplemented");
  },
  handleBr(node, displayList, config) {
    displayList.push('\n');
  },
  handleCode(node, displayList, config) {
    console.log("CODE is unimplemented");
  },
  handleBlockquote(node, displayList, config) {
    console.log("BLOCKQUOTE is unimplemented");
  },
  handlePre(node, displayList, config) {
    console.log("PRE is unimplemented");
  },
  handleA(node, displayList, config) {
    console.log("A is unimplemented");
  },
  handleText(node, displayList, config) {
    displayList.push(node.textContent);
  },

  layout(HTMLString, config) {
    const document = new JSDOM(HTMLString).window.document;
    let displayList = [];
    let walker = document.createTreeWalker(document.documentElement, -1, null, false)
    while (walker.nextNode()){
      //Do something with the current node
      switch (walker.currentNode.nodeName) {
        case 'HEAD':
          this.handleHead(walker.currentNode, displayList, config);
          break;
        case 'TITLE':
          this.handleTitle(walker.currentNode, displayList, config);
          break;
        case 'BODY':
          this.handleBody(walker.currentNode, displayList, config);
          break;
        case 'H1':
          this.handleH1(walker.currentNode, displayList, config);
          break;
        case 'H2':
          this.handleH2(walker.currentNode, displayList, config);
          break;
        case 'H3':
          this.handleH3(walker.currentNode, displayList, config);
          break;
        case 'H4':
          this.handleH4(walker.currentNode, displayList, config);
          break;
        case 'H5':
          this.handleH5(walker.currentNode, displayList, config);
          break;
        case 'H6':
          this.handleH6(walker.currentNode, displayList, config);
          break;
        case 'P':
          this.handleP(walker.currentNode, displayList, config);
          break;
        case 'UL':
          this.handleUl(walker.currentNode, displayList, config);
          break;
        case 'OL':
          this.handleOl(walker.currentNode, displayList, config);
          break;
        case 'LI':
          this.handleLi(walker.currentNode, displayList, config);
          break;
        case 'STRONG':
          this.handleStrong(walker.currentNode, displayList, config);
          break;
        case 'BR':
          this.handleBr(walker.currentNode, displayList, config);
          break;
        case 'CODE':
          this.handleCode(walker.currentNode, displayList, config);
          break;
        case 'BLOCKQUOTE':
          this.handleBlockquote(walker.currentNode, displayList, config);
          break;
        case 'PRE':
          this.handlePre(walker.currentNode, displayList, config);
          break;
        case 'A':
          this.handleA(walker.currentNode, displayList, config);
          break;
        case '#text':
          this.handleText(walker.currentNode, displayList, config);
          break;
        default:
          console.log(`${walker.currentNode.nodeName} is unimplemented.`);
          break;
      }
    }
    console.log(displayList);
    let output = displayList.join('');

    return output;
  },
};

module.exports = ToyLayoutEngine;
