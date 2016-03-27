'use strict'

import it from 'ava'

if (global.document) {
	it.beforeEach(() => {
		const container = document.createElement('div')
		container.id = 'test'
		document.body.appendChild(container)
	})

	it.afterEach(() => {
		document.getElementById('test').outerHTML = ''
	})
}


it('sets a string as textContent', (test) => {
	const expected = '<p>test</p>'
	let element = shaven(['p', 'test'])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	test.is(element, expected)
})


it('sets a number as textContent', (test) => {
	const expected = '<p>1234</p>'
	let element = shaven(['p', 1234])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	test.is(element, expected)
})


it('builds elements recursively', (test) => {
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

	test.is(actual, expected)
})


it('is possible to set properties', (test) => {
	const expectedString = '<p id="foo" class="bar" data-info="baz"></p>'
	let actual = shaven(
		['p', {
			id: 'foo',
			class: 'bar',  // class is restricted word
			'data-info': 'baz' // attribute with dash
		}]
	).rootElement

	if (typeof actual === 'string') {
		test.is(actual, expectedString)
	}
	else {
		document.getElementById('test').innerHTML = expectedString

		const expectedElement = document.getElementById('foo')

		test.true(
			actual.isEqualNode(expectedElement),
			'\n' + actual.outerHTML +
			'\nshould equal\n' + expectedElement.outerHTML
		)
	}
})


it('does not set falsy properties', (test) => {
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
		test.is(actual, expectedString)
	}
	else {
		document.getElementById('test').innerHTML = expectedString

		const expectedElement = document.getElementsByTagName('p')[0]

		test.true(
			actual.isEqualNode(expectedElement),
			'\n' + actual.outerHTML + '\nshould equal\n' +
				expectedElement.outerHTML
		)
	}
})


it('builds a string from a style object', (test) => {
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

	test.is(actual, expected)
})


it('does not include falsy values in style string', (test) => {
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

	test.is(actual, expected)
})


it('does ignore "true" values', (test) => {
	const expected = '<p>test</p>'
	let actual = shaven(['p', 'test', true])[0]

	if (typeof actual !== 'string')
		actual = actual.outerHTML

	test.is(actual, expected)
})



it('uses div as default tag', (test) => {
	const expected = '<div id="foo"></div>'
	let actual = shaven(['#foo'])[0]

	if (typeof actual !== 'string')
		actual = actual.outerHTML

	test.is(actual, expected)
})


it('sets the id', (test) => {
	const expected = '<p id="foo-1"></p>'
	let actual = shaven(['p#foo-1'])[0]

	if (typeof actual !== 'string')
		actual = actual.outerHTML

	test.is(actual, expected)
})


it('sets the class', (test) => {
	const expected = '<p class="foo"></p>'
	let actual = shaven(['p.foo'])[0]

	if (typeof actual !== 'string')
		actual = actual.outerHTML

	test.is(actual, expected)
})


it('works with both class and id', (test) => {
	const expectedString = '<p id="b" class="new"></p>'
	let element = shaven(['p#b.new'])[0]

	if (typeof element === 'string') {
		test.is(element, expectedString)
	}
	else {
		document.getElementById('test').innerHTML = expectedString

		const expectedElement = document.getElementById('b')

		test.true(
			element.isEqualNode(expectedElement),
			element.outerHTML +
			'\nshould be equal to\n' +
			expectedElement.outerHTML
		)
	}
})


it('works with class and id reversed', (test) => {
	const expectedString = '<p id="c" class="new"></p>'
	let element = shaven(['p.new#c'])[0]

	if (typeof element === 'string') {
		test.is(element, expectedString)
	}
	else {
		document
			.getElementById('test')
			.innerHTML = expectedString

		const expectedElement = document
			.getElementById('c')

		test.true(
			element.isEqualNode(expectedElement),
			element.outerHTML +
			'\nshould to be equal to\n' +
			expectedElement.outerHTML
		)
	}
})


it('understands multiple classes and ids', (test) => {
	const expectedString = '<p id="foo" class="bar baz"></p>'
	let element = shaven(['p.bar#foo.baz'])[0]

	if (typeof element === 'string') {
		test.is(element, expectedString)
	}
	else {
		document
			.getElementById('test')
			.innerHTML = expectedString

		const expectedElement = document
			.getElementById('foo')

		test.true(
			element.isEqualNode(expectedElement),
			element.outerHTML +
			'\nshould to be equal to\n' +
			expectedElement.outerHTML
		)
	}
})


it('calls the provided callback function', (test) => {
	let called = false
	let element = false

	function foo (el) {
		called = true
		element = el
	}

	const shavenObject = shaven(['p#bar', foo])

	test.true(called)
	test.is(element, shavenObject[0])
})


it('returns a shaven object and not an html element/string', (test) => {
	const shavenObject = shaven(['p'])

	test.is(typeof shavenObject, 'object')
	test.not(shavenObject.nodeType, 1)
})

it('links ids and references', (test) => {
	const shavenObject = shaven(['ul',
		['li#first', 'First'],
		['li$second', 'Second']
	])

	if (typeof shavenObject.rootElement !== 'string') {
		test.is(shavenObject.ids.first.outerHTML, '<li id="first">First</li>')
		test.is(shavenObject.references.second.outerHTML, '<li>Second</li>')
	}
})

it('returns the root html element by referencing [0]', (test) => {
	const shavenObject = shaven(['p'])
	const element = shavenObject[0]

	if (typeof element === 'string')
		test.is('<p></p>', element)
	else
		test.is(element.nodeType, 1)
})


it('returns the root HTML element by referencing rootElement', (test) => {
	const shavenObject = shaven(['p'])
	const element = shavenObject.rootElement

	if (typeof element === 'string')
		test.is('<p></p>', element)
	else
		test.is(element.nodeType, 1)
})


it('returns the HTML of the root element when converted to string', (test) => {
	const shavenObject = shaven(['p#test', 'Test'])

	test.is('<p id="test">Test</p>', String(shavenObject))
})


it('escapes html strings in tags', (test) => {
	const html = '<p>Some <strong>HTML</strong></p>'
	const escapedHtml = '&lt;p&gt;Some ' +
		'&lt;strong&gt;HTML&lt;/strong&gt;' +
		'&lt;/p&gt;'
	let element = shaven(['div', html])[0]

	if (typeof element === 'string')
		test.is(element, '<div>' + escapedHtml + '</div>')
	else
		test.is(element.innerHTML, escapedHtml)
})


it('sets attribute to 0', (test) => {
	const html = '<p title="0">Test</p>'
	let element = shaven(['p', 'Test', {title: 0}])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	test.is(element, html)
})


it('escapes html strings in attributes', (test) => {
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

	test.is(element, escapedHtml)
})


it('builds html from strings', (test) => {
	const html = '<p>Some <strong>HTML</strong></p>'
	let element = shaven(['div&', html])[0]

	if (typeof element === 'string')
		test.is(element, '<div>' + html + '</div>')
	else
		test.is(element.innerHTML, html)
})


it('accepts an array of elements', (test) => {
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

	test.is(element, html)
})


it('accepts an array of elements at index 0', (test) => {
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

	test.is(element, html)
})


it('throws an error for an invalid array', (test) => {
	const regexString = '.*first ' +
		'element.*must be.*string.*array.*'

	test.throws(
		() => {
			shaven([{key: 'value'}])
		},
		new RegExp(regexString, 'gi')
	)

	test.throws(
		() => {
			shaven([144, 'span', 'text'])
		},
		new RegExp(regexString, 'gi')
	)
})


it('works with SVGs', (test) => {
	const expectedString = '' +
		'<svg id="svg" height="10" width="10">' +
			'<circle class="top" cx="5" cy="5" r="5" style="fill:green">' +
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
	const svgElement = shaven(array, 'http://www.w3.org/2000/svg').rootElement

	if (typeof svgElement === 'string') {
		test.is(svgElement, expectedString)
	}
	else {
		document.getElementById('test').innerHTML = expectedString

		const expectedElement = document.getElementById('svg')

		test.true(
			svgElement.isEqualNode(expectedElement),
			'\n' + svgElement.outerHTML +
			'\nshould equal\n' +
			expectedElement.outerHTML
		)
	}
})


it('escapes text in SVGs', (test) => {
	const array = ['svg#svg',
		['text', '<circle>']
	]
	const expectedString = '<svg id="svg"><text>&lt;circle&gt;</text></svg>'
	const svgElement = shaven(array, 'http://www.w3.org/2000/svg').rootElement

	if (typeof svgElement === 'string') {
		test.is(svgElement, expectedString)
	}
	else {
		document.getElementById('test').innerHTML = expectedString
		const expectedElement = document.getElementById('svg')

		test.true(
			svgElement.isEqualNode(expectedElement),
			'\n' + svgElement.outerHTML + '\nshould equal\n' +
			expectedElement.outerHTML
		)
	}
})



it('returns an empty element for missing content value', (test) => {
	let element = shaven(['div'])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	test.is(element, '<div></div>')
})


it('returns an empty element for undefined content value', (test) => {
	let element = shaven(['div', undefined])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	test.is(element, '<div></div>')
})


it('returns no element if content value is "false"', (test) => {
	let element = shaven(['div', ['p', false]])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	test.is(element, '<div></div>')
})


it('returns no element if content value is "null"', (test) => {
	let element = shaven(['div', ['p', null]])[0]

	if (typeof element !== 'string')
		element = element.outerHTML

	test.is(element, '<div></div>')
})
