// Libraries
const assert = require('assert');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const CONTEXT_TYPE_BLOCK = 1;
const CONTEXT_TYPE_INLINE = 2;

const UNORDERED_LIST = 1;
const UNORDERED_LIST_BULLETS = ['*', '+', 'o', '#', '@', '-', '='];
const ORDERED_LIST = 2;


function ElementContext(lastContext, el, type, indent, extra = {}) {
  this.lastContext = lastContext;
  this.el = el;
  this.type = type;

  if (this.type == CONTEXT_TYPE_BLOCK) {
    this.indent = indent;
    if (lastContext) {
      this.indent += lastContext.indent;
    }
  } else if (this.type == CONTEXT_TYPE_INLINE) {
    this.indent = 1;
  }

  this.extra = extra;
  this.extra.listDepth = 0;

  if (this.extra.listType) {
    this.extra.listDepth = lastContext.extra.listDepth + 1;
  } else if (lastContext) {
    this.extra.listDepth = lastContext.extra.listDepth;
  }

  this.ignoreWhitespace = true;
}

ElementContext.prototype = {
  isLastChild(node) {
    if (this.el) {
      return node === this.el.lastChild;
    }
    return false;
  },

  get isListItem() {
    return this.el && this.el.tagName == "LI";
  },

  findContextWithBullet() {
    let context = this;
    while (context) {
      if (context.extra.listBullet !== undefined) {
        return context;
      }
      context = context.lastContext;
    }

    return null;
  },

  get hasBullet() {
    let context = this.findContextWithBullet();
    return context && !context.extra.usedBullet;
  },

  get hadBullet() {
    let context = this.findContextWithBullet();
    return context && context.extra.usedBullet;
  },

  get bulletLength() {
    let context = this.findContextWithBullet();
    if (!context) {
      return 0;
    }
    return context.extra.listBullet.length;
  },

  takeBullet() {
    let context = this.findContextWithBullet();
    assert(context,
      "takeBullet should only be called if we have a bullet");
    let bullet = context.extra.listBullet;
    context.extra.usedBullet = true;
    return { bullet, indent: context.indent };
  }
};

// Public interface
let ToyLayoutEngine = {
  handleHead(context, node, displayList) {
    // Nothing we need to do here.
    return context;
  },
  handleTitle(context, node, displayList) {
    // Remove the previous text, because we're a block element.
    let spaces = this.config.cols - node.textContent.length - 1;
    return new ElementContext(context, node, CONTEXT_TYPE_BLOCK, spaces);
  },
  handleBody(context, node, displayList) {
    // Nothing we need to do here.
    return context;
  },
  handleH1(context, node, displayList) {
    // Remove the previous whitespace, because we're a block element.
    let spaces = (this.config.cols - node.textContent.length) / 2;
    //this.pushStackingContext(node, ' '.repeat(spaces), true);
    displayList.push('\n');

    return context;
  },
  handleH2(context, node, displayList) {
    // Remove the previous text, because we're a block element.
    displayList.push('\n\n');

    return context;
  },
  handleH3(context, node, displayList) {
    // Remove the previous text, because we're a block element.
    //this.pushStackingContext(node, '  ', true);
    displayList.push('\n\n');

    return context;
  },
  handleH4(context, node, displayList) {
    // Remove the previous text, because we're a block element.
    //this.pushStackingContext(node, '    ', true);
    displayList.push('\n\n');

    return context;
  },
  handleH5(context, node, displayList) {
    // Remove the previous text, because we're a block element.
    //this.pushStackingContext(node, '      ', true);
    displayList.push('\n\n');

    return context;
  },
  handleH6(context, node, displayList) {
    // Remove the previous text, because we're a block element.
    //this.pushStackingContext(node, '        ', true);
    displayList.push('\n\n');

    return context;
  },
  handleP(context, node, displayList) {
    // display: block - but if we're inside a list, we don't need
    // to space ourselves out.
    if (!context.isListItem) {
      displayList.push('\n\n');
    }

    return new ElementContext(context, node, CONTEXT_TYPE_BLOCK, 0);
  },
  handleUl(context, node, displayList) {
    // UL is display: block, so break onto a new line.
    let indentSize = 5;
    if (context.hasBullet) {
      let { bullet, indent } = context.takeBullet();
      let indentation = ' '.repeat(indent);
      let prefix = bullet;
      displayList.push(indentation + prefix);
    }

    return new ElementContext(context, node, CONTEXT_TYPE_BLOCK, indentSize, {
      listType: UNORDERED_LIST,
    });
  },
  handleOl(context, node, displayList) {
    displayList.push('\n');
    //this.pushStackingContext(node, '    1. ', true);

    return context;
  },
  handleLi(context, node, displayList) {
    // LI is display: block
    displayList.push('\n');
    assert(context.extra.listType, "Should be inside a list.");

    let bullet;

    if (context.extra.listType === UNORDERED_LIST) {
      let index = (context.extra.listDepth - 1) % UNORDERED_LIST_BULLETS.length;
      bullet = UNORDERED_LIST_BULLETS[index];
    } else {
      // TODO
      //bullet = `${itemNum}.`
    }
    assert(bullet, "Should have selected a bullet.");

    return new ElementContext(context, node, CONTEXT_TYPE_BLOCK, 0, {
      listBullet: bullet,
    });
  },
  handleStrong(context, node, displayList) {
    return new ElementContext(context, node, CONTEXT_TYPE_INLINE);
  },
  handleBr(context, node, displayList) {
    displayList.push('\n');

    return context;
  },
  handleCode(context, node, displayList) {
    console.log("CODE is unimplemented");

    return context;
  },
  handleBlockquote(context, node, displayList) {
    console.log("BLOCKQUOTE is unimplemented");

    return context;
  },
  handlePre(context, node, displayList) {
    console.log("PRE is unimplemented");

    return context;
  },
  handleA(context, node, displayList) {
    console.log("A is unimplemented");

    return context;
  },
  handleText(context, node, displayList) {
    if (context.ignoreWhitespace && node.textContent.trim() == "") {
      return context;
    }

    let indentation = '';
    let prefix = '';
    if (context.hasBullet) {
      let { bullet, indent } = context.takeBullet();
      indentation = ' '.repeat(indent);
      prefix = bullet + ' ';
    } else if (context.hadBullet) {
      indentation = ' '.repeat(context.indent + context.bulletLength + 1);
    } else {
      indentation  = ' '.repeat(context.indent);
    }

    displayList.push(indentation + prefix + node.textContent.trim());
    return context;
  },

  layout(HTMLString, config) {
    this.config = config;
    let context = new ElementContext(null, null, CONTEXT_TYPE_BLOCK, 0);
    const document = new JSDOM(HTMLString).window.document;
    let displayList = [];
    let walker = document.createTreeWalker(document.documentElement, -1, null, false)

    while (walker.nextNode()){
      switch (walker.currentNode.nodeName) {
        case 'HEAD':
          context = this.handleHead(context, walker.currentNode, displayList);
          break;
        case 'TITLE':
          context = this.handleTitle(context, walker.currentNode, displayList);
          break;
        case 'BODY':
          context = this.handleBody(context, walker.currentNode, displayList);
          break;
        case 'H1':
          context = this.handleH1(context, walker.currentNode, displayList);
          break;
        case 'H2':
          context = this.handleH2(context, walker.currentNode, displayList);
          break;
        case 'H3':
          context = this.handleH3(context, walker.currentNode, displayList);
          break;
        case 'H4':
          context = this.handleH4(context, walker.currentNode, displayList);
          break;
        case 'H5':
          context = this.handleH5(context, walker.currentNode, displayList);
          break;
        case 'H6':
          context = this.handleH6(context, walker.currentNode, displayList);
          break;
        case 'P':
          context = this.handleP(context, walker.currentNode, displayList);
          break;
        case 'UL':
          context = this.handleUl(context, walker.currentNode, displayList);
          break;
        case 'OL':
          context = this.handleOl(context, walker.currentNode, displayList);
          break;
        case 'LI':
          context = this.handleLi(context, walker.currentNode, displayList);
          break;
        case 'STRONG':
          context = this.handleStrong(context, walker.currentNode, displayList);
          break;
        case 'BR':
          context = this.handleBr(context, walker.currentNode, displayList);
          break;
        case 'CODE':
          context = this.handleCode(context, walker.currentNode, displayList);
          break;
        case 'BLOCKQUOTE':
          context = this.handleBlockquote(context, walker.currentNode, displayList);
          break;
        case 'PRE':
          context = this.handlePre(context, walker.currentNode, displayList);
          break;
        case 'A':
          context = this.handleA(context, walker.currentNode, displayList);
          break;
        case '#text':
          context = this.handleText(context, walker.currentNode, displayList);
          break;
        default:
          console.log(`${walker.currentNode.nodeName} is unimplemented.`);
          break;
      }

      if (context.isLastChild(walker.currentNode)) {
        context = context.lastContext;
      }
    }
    let output = displayList.join('');

    return output;
  },
};

module.exports = ToyLayoutEngine;

let args = process.argv.slice(2);
if (args[0]) {
  const fs = require("fs");
  console.log(ToyLayoutEngine.layout(fs.readFileSync(args[0], "utf-8"), {
    cols: 80,
    lines: 50,
  }));
}
