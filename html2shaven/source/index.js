const parse5 = require('parse5')
const minifier = require('html-minifier')

const parser = new parse5.Parser()


function walkTree (node) {
  if (node.nodeName === '#document') {
    return walkTree(node.childNodes[1])
  }

  if (Array.isArray(node)) {
    return node.map(walkTree)
  }

  if (node.childNodes) {
    return [
      node.nodeName,
      ...[
        node.attrs.reduce(
          (object, attribute) => {
            object[attribute.name] = attribute.value
            return object
          },
          {},
        ),
        ...walkTree(node.childNodes),
      ].filter(aNode => Object.keys(aNode).length > 0),
    ]
  }

  if (node.nodeName === '#documentType') {
    return ''
  }
  if (node.nodeName !== '#comment') {
    return node.value
  }
}

module.exports = function (htmlString) {

  const minifiedHtmlString = minifier.minify(
    htmlString,
    {
      collapseWhitespace: true,
    },
  )
  const document = parser.parse(minifiedHtmlString)

  return walkTree(document)
}
