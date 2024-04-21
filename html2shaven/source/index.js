'use strict'

const parse5 = require('parse5')
const minifier = require('html-minifier')

let parser = new parse5.Parser()


function walkTree (node) {
	if (node.nodeName === '#document') {
		return walkTree(node.childNodes[1])
	}

	if (Array.isArray(node))
		return node.map(walkTree)

	if (node.childNodes)
		return [
			node.nodeName,
			...([
				node.attrs.reduce(
					(object, attribute) => {
						object[attribute.name] = attribute.value
						return object
					},
					{}
				),
				...walkTree(node.childNodes)
			].filter(n => Object.keys(n).length > 0))
		]

	if (node.nodeName === '#documentType')
		return ''

	if (node.nodeName !== '#comment')
		return node.value
}

module.exports = function (htmlString) {

	let minifiedHtmlString = minifier.minify(
		htmlString,
		{
			collapseWhitespace: true
		}
	)
	let document = parser.parse(minifiedHtmlString)

	return walkTree(document)
}
