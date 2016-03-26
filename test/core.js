'use strict'

import it from 'ava'
import assert from 'assert'
import shaven from '..'

let document = document || null

if (document) {
	it.beforeEach(() => {
		const container = document.createElement('div')
		container.id = 'test'
		document.body.appendChild(container)
	})

	it.afterEach(() => {
		document.getElementById('test').outerHTML = ''
	})
}


it('sets a string as textContent', (done) => {
	const expected = '<p>test</p>'
	let element = shaven(['p', 'test'])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	assert.strictEqual(element, expected)
})


it('sets a number as textContent', (done) => {
	const expected = '<p>1234</p>'
	let element = shaven(['p', 1234])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	assert.strictEqual(element, expected)
})


it('builds elements recursively', (done) => {
	const expected = '<div><p>foo<em>bar</em></p></div>'
	let actual = shaven(
		['div',
			['p', 'foo',
				['em', 'bar']
			]
		]
	)[0]

	if (typeof actual !== 'string')
		actual = actual.outerHTML

	assert.strictEqual(actual, expected)
})


it('is possible to set properties', (done) => {
	const expectedString = '<p id="foo" ' +
		'class="bar" data-info="baz"></p>'
	let actual = shaven(
		['p', {
			id: 'foo',
			class: 'bar',  // class is restricted word
			'data-info': 'baz' // attribute with dash
		}]
	)[0]

	if (typeof actual === 'string') {
		assert.strictEqual(actual, expectedString)
	}
	else {
		document.getElementById('test').innerHTML = expectedString

		const expectedElement = document.getElementById('foo')

		assert(
			actual.isEqualNode(expectedElement),
			'\n' + actual.outerHTML +
			'\nshould equal\n' + expectedElement.outerHTML
		)
	}
})


it('does not set falsy properties', (done) => {
	const expectedString = '<p title="foo" ' +
		'tabindex="3" data-info=""></p>'
	let actual = shaven(
		['p', {
			title: 'foo',
			tabindex: 3,
			lang: false,
			'data-test': null,
			'data-info': undefined
		}]
	)[0]


	if (typeof actual === 'string') {
		assert.strictEqual(actual, expectedString)
	}
	else {
		document.getElementById('test').innerHTML = expectedString

		const expectedElement = document.getElementsByTagName('p')[0]

		assert(
			actual.isEqualNode(expectedElement),
			'\n' + actual.outerHTML + '\nshould equal\n' +
				expectedElement.outerHTML
		)
	}
})


it('builds a string from a style object', (done) => {
	const expected = '<p ' +
		'style="color:rgb(255,0,0);font-size:10;' +
			'font-family:Arial, \'Helvetica Neue\', ' +
			'sans-serif"></p>'
	let actual = shaven(
		['p', {
			style: {
				color: 'rgb(255,0,0)',
				'font-size': 10,
				'font-family': 'Arial, "Helvetica Neue", sans-serif'
			}
		}]
	)[0]

	if (typeof actual !== 'string')
		actual = actual.outerHTML

	assert.strictEqual(actual, expected)
})


it('does not include falsy values in style string', (done) => {
	const expected = '<p style="color:red"></p>'
	let actual = shaven(
		['p', {
			style: {
				color: 'red',
				border: false,
				'background-color': null,
				visibility: undefined
			}
		}]
	)[0]

	if (typeof actual !== 'string')
		actual = actual.outerHTML

	assert.strictEqual(actual, expected)
})


it('does ignore "true" values', (done) => {
	const expected = '<p>test</p>'
	let actual = shaven(['p', 'test', true])[0]

	if (typeof actual !== 'string')
		actual = actual.outerHTML

	assert.strictEqual(actual, expected)
})



it('uses div as default tag', (done) => {
	const expected = '<div id="foo"></div>'
	let actual = shaven(['#foo'])[0]

	if (typeof actual !== 'string')
		actual = actual.outerHTML

	assert.strictEqual(actual, expected)
})


it('sets the id', (done) => {
	const expected = '<p id="foo-1"></p>'
	let actual = shaven(['p#foo-1'])[0]

	if (typeof actual !== 'string')
		actual = actual.outerHTML

	assert.strictEqual(actual, expected)
})


it('sets the class', (done) => {
	const expected = '<p class="foo"></p>'
	let actual = shaven(['p.foo'])[0]

	if (typeof actual !== 'string')
		actual = actual.outerHTML

	assert.strictEqual(actual, expected)
})


it('works with both class and id', (done) => {
	const expectedString = '<p id="b" class="new"></p>'
	let element = shaven(['p#b.new'])[0]

	if (typeof element === 'string') {
		assert.strictEqual(element, expectedString)
	}
	else {
		document.getElementById('test').innerHTML = expectedString

		const expectedElement = document.getElementById('b')

		assert(
			element.isEqualNode(expectedElement),
			element.outerHTML +
			'\nshould be equal to\n' +
			expectedElement.outerHTML
		)
	}
})


it('works with class and id reversed', (done) => {
	const expectedString = '<p id="c" class="new"></p>'
	let element = shaven(['p.new#c'])[0]

	if (typeof element === 'string') {
		assert.strictEqual(element, expectedString)
	}
	else {
		document
			.getElementById('test')
			.innerHTML = expectedString

		const expectedElement = document
			.getElementById('c')

		assert(
			element.isEqualNode(expectedElement),
			element.outerHTML +
			'\nshould to be equal to\n' +
			expectedElement.outerHTML
		)
	}
})


it('understands multiple classes and ids', (done) => {
	const expectedString = '<p id="foo" class="bar baz"></p>'
	let element = shaven(['p.bar#foo.baz'])[0]

	if (typeof element === 'string') {
		assert.strictEqual(element, expectedString)
	}
	else {
		document
			.getElementById('test')
			.innerHTML = expectedString

		const expectedElement = document
			.getElementById('foo')

		assert(
			element.isEqualNode(expectedElement),
			element.outerHTML +
			'\nshould to be equal to\n' +
			expectedElement.outerHTML
		)
	}
})


it('calls the provided callback function', (done) => {
	let called = false
	let element = false

	function foo (el) {
		called = true
		element = el
	}

	const shavenObject = shaven(['p#bar', foo])

	assert(called)
	assert.strictEqual(element, shavenObject[0])
})


it('returns a shaven object and not an html element/string', (done) => {
	const shavenObject = shaven(['p'])

	assert(typeof shavenObject === 'object')
	assert.notStrictEqual(shavenObject.nodeType, 1)
})


it('returns the root html element by referencing [0]', (done) => {
	const shavenObject = shaven(['p'])
	const element = shavenObject[0]

	if (typeof element === 'string')
		assert.strictEqual('<p></p>', element)
	else
		assert.strictEqual(element.nodeType, 1)
})


it('escapes html strings in tags', (done) => {
	const html = '<p>Some <strong>HTML</strong></p>'
	const escapedHtml = '&lt;p&gt;Some ' +
		'&lt;strong&gt;HTML&lt;/strong&gt;' +
		'&lt;/p&gt;'
	let element = shaven(['div', html])[0]

	if (typeof element === 'string')
		assert.strictEqual(element, '<div>' + escapedHtml + '</div>')
	else
		assert.strictEqual(element.innerHTML, escapedHtml)
})


it('sets attribute to 0', (done) => {
	const html = '<p title="0">Test</p>'
	let element = shaven(['p', 'Test', {title: 0}])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	assert.strictEqual(element, html)
})


it('escapes html strings in attributes', (done) => {
	const escapedHtml =
		'<p ' +
		'title="&quot; &amp;" ' +
		'lang="\' < >"' +
		'>' +
		'Test' +
		'</p>'
	let element = shaven(
		['p', 'Test', {
			title: '" &',
			lang: '\' < >'
		}]
	)[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	assert.strictEqual(element, escapedHtml)
})


it('builds html from strings', (done) => {
	const html = '<p>Some <strong>HTML</strong></p>'
	let element = shaven(['div&', html])[0]

	if (typeof element === 'string')
		assert.strictEqual(element, '<div>' + html + '</div>')
	else
		assert.strictEqual(element.innerHTML, html)
})


it('accepts an array of elements', (done) => {
	const html = '<p>Numbers: ' +
		'<span>1</span>' +
		'<span>2</span>' +
		'<span>3</span>' +
		'<span>4</span>' +
		'<span>5</span>' +
		'</p>'
	let element = shaven(
		['p', 'Numbers: ', [
			['span', '1'],
			['span', '2'],
			['span', '3'],
			[
				['span', '4'],
				['span', '5']
			]
		]]
	)[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	assert.strictEqual(element, html)
})


it('accepts an array of elements at index 0', (done) => {
	const html = '<p>Numbers: ' +
		'<span>1</span>' +
		'<span>2</span>' +
		'<span>3</span>' +
		'</p>'
	let element = shaven(['p', 'Numbers: ', [
		[
			['span', '1'],
			['span', '2'],
			['span', '3']
		]
	]])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	assert.strictEqual(element, html)
})


it('throws an error for an invalid array', (done) => {
	const regexString = '.*first ' +
		'element.*must be.*string.*array.*'

	assert.throws(
		() => {
			shaven([{key: 'value'}])
		},
		new RegExp(regexString, 'gi')
	)

	assert.throws(
		() => {
			shaven([144, 'span', 'text'])
		},
		new RegExp(regexString, 'gi')
	)
})


it('works with SVGs', (done) => {
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
	const element = shaven(array)[0]


	if (typeof element === 'string') {
		assert.strictEqual(element, expectedString)
	}
	else {
		const svgElement = shaven(array, 'http://www.w3.org/2000/svg')[0]

		document.getElementById('test').innerHTML = expectedString

		const expectedElement = document.getElementById('svg')

		assert(
			svgElement.isEqualNode(expectedElement),
			'\n' + svgElement.outerHTML +
			'\nshould equal\n' +
			expectedElement.outerHTML
		)
	}
})



it('returns an empty element for missing content value', (done) => {
	let element = shaven(['div'])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	assert.strictEqual(element, '<div></div>')
})


it('returns an empty element for undefined content value', (done) => {
	let element = shaven(['div', undefined])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	assert.strictEqual(element, '<div></div>')
})


it('returns no element if content value is "false"', (done) => {
	let element = shaven(['div', ['p', false]])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	assert.strictEqual(element, '<div></div>')
})


it('returns no element if content value is "null"', (done) => {
	let element = shaven(['div', ['p', null]])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	assert.strictEqual(element, '<div></div>')
})
