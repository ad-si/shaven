'use strict'

import it from 'ava'
import assert from 'assert'
import shaven from '../source/library/browser.js'

it.beforeEach(() => {
	const container = document.createElement('div')
	container.id = 'test'
	document.body.appendChild(container)
})

it.afterEach(() => {
	document.getElementById('test').outerHTML = ''
})


it('attaches to elements', () => {
	const container = document.getElementById('test')
	const expected = '<div id="test"><p></p></div>'
	const actual = shaven([container, ['p']])[0].outerHTML

	assert.strictEqual(actual, expected, actual)
})


it('appends html elements', () => {
	const container = document.getElementById('test')
	const expected = '<div id="test"><p></p></div>'
	const element = shaven(['p'])[0]
	const actual = shaven([container, element])[0].outerHTML

	assert.strictEqual(actual, expected, actual)
})


it('supports hyphens in html tags', () => {
	const container = document.getElementById('test')
	const expected = '<div id="test">' +
		'<foo-bar></foo-bar>' +
		'</div>'
	const element = shaven(['foo-bar'])[0]
	const actual = shaven([container, element])[0].outerHTML

	assert.strictEqual(actual, expected, actual)
})


it('returns a shaven object with element-ids as keys', () => {
	const container = document.getElementById('test')
	const shavenObject = shaven(
		[container,
			['p#foo'],
			['p#bar']
		]
	)

	assert.strictEqual(shavenObject.foo, document.getElementById('foo'))
	assert.strictEqual(shavenObject.bar, document.getElementById('bar'))
})


it('returns marked elements ', () => {
	const container = document.getElementById('test')
	const shavenObject = shaven(
		[container,
			['a$foo'],
			['p$bar']
		]
	)

	assert.strictEqual(
		shavenObject.foo,
		document.getElementsByTagName('a')[0]
	)
	assert.strictEqual(
		shavenObject.bar,
		document.getElementsByTagName('p')[0]
	)
})


it('does not work with SVGs without a namespace', () => {
	const container = document.getElementById('test')
	const expectedString = '' +
		'<svg id="svg" height="10" width="10">' +
			'<circle class="top" cx="5" cy="5" r="5" ' +
				'style="fill:green">' +
			'</circle>' +
		'</svg>'
	const array = ['svg#svg',
		{
			height: 10,
			width: 10
		},
		['circle.top', {
			cx: 5,
			cy: 5,
			r: 5,
			style: 'fill:green'
		}]
	]

	container.innerHTML = expectedString

	const svgElement = shaven(array)[0]
	const expectedElement = document.getElementById('svg')
	const areEqual = svgElement.isEqualNode(expectedElement)

	assert(
		(svgElement.outerHTML === expectedElement.outerHTML) &&
		!areEqual,
		'Although the elements have the same outerHTML, ' +
		'they should not be equal nodes.\n' +
		'svgElement:\t\t' + svgElement.outerHTML +
		'\nexpectedElement:\t' + expectedElement.outerHTML +
		'\nAre equal:\t' + areEqual
	)
})
