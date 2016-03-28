'use strict'

import it from 'ava'

it.beforeEach(() => {
	const container = document.createElement('div')
	container.id = 'test'
	document.body.appendChild(container)
})

it.afterEach(() => {
	document.getElementById('test').outerHTML = ''
})


it('attaches to elements', (test) => {
	const container = document.getElementById('test')
	const expected = '<div id="test"><p></p></div>'
	const actual = shaven([container, ['p']])[0].outerHTML

	test.is(actual, expected, actual)
})


it('appends html elements', (test) => {
	const container = document.getElementById('test')
	const expected = '<div id="test"><p></p></div>'
	const element = shaven(['p'])[0]
	const actual = shaven([container, element])[0].outerHTML

	test.is(actual, expected, actual)
})


it('supports hyphens in html tags', (test) => {
	const container = document.getElementById('test')
	const expected = '<div id="test">' +
		'<foo-bar></foo-bar>' +
		'</div>'
	const element = shaven(['foo-bar'])[0]
	const actual = shaven([container, element])[0].outerHTML

	test.is(actual, expected, actual)
})


it('returns a shaven object with links to elements with ids', (test) => {
	const container = document.getElementById('test')
	const shavenObject = shaven(
		[container,
			['p#foo'],
			['p#bar']
		]
	)

	test.is(shavenObject.ids.foo, document.getElementById('foo'))
	test.is(shavenObject.ids.bar, document.getElementById('bar'))
})


it('returns marked elements ', (test) => {
	const container = document.getElementById('test')
	const shavenObject = shaven(
		[container,
			['a$foo'],
			['p$bar']
		]
	)

	test.is(
		shavenObject.references.foo,
		document.getElementsByTagName('a')[0]
	)
	test.is(
		shavenObject.references.bar,
		document.getElementsByTagName('p')[0]
	)
})


it('uses specified namespace', (test) => {
	const circle = shaven({
		namespace: 'svg',
		elementArray: ['circle', {r: 5}],
	})
	let svgElement = shaven(['svg',
		['rect', {width: 5, height: 5}],
		circle.rootElement
	]).rootElement

	if (typeof svgElement !== 'string')
		svgElement = svgElement.outerHTML

	test.is(
		svgElement,
		'<svg>' +
			'<rect width="5" height="5"></rect>' +
			'<circle r="5"></circle>' +
		'</svg>'
	)
})
