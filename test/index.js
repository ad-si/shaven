!function () {

	'use strict'

	var assert,
	    scope = {},
	    isBrowser = (typeof window !== 'undefined'),
	    shaven,
	    jsdom


	function getById (id, window) {
		return window.document.getElementById(id)
	}

	function runTestSuite (environment) {

		function testInEnv (html, callback) {

			if (environment === 'browser')
				callback(null, window)

			else if (environment === 'jsdom')
				jsdom.env({
					html: html === null ? '<div></div>' : html,
					scripts: ['../src/shaven.js'],
					done: callback
				})

			else if (environment === 'nodejs') {
				scope.shaven = shaven
				callback(null, scope)
			}

		}


		afterEach(function () {

			if (environment === 'browser')
				getById('test', window).innerHTML = ''
		})


		describe('Shaven in ' + environment + ' environment', function () {

			if (environment === 'browser' || environment === 'jsdom') {


				it('should be attachable to elements', function (done) {

					testInEnv('<div id="test"></div>', function (error, window) {

						assert.ifError(error)

						var expected = '<div id="test"><p></p></div>',
						    actual = window.shaven(
							    [getById('test', window), ['p']]
						    )[0].outerHTML

						assert.strictEqual(actual, expected, actual)

						done()
					})
				})


				it('should append html elements', function (done) {

					testInEnv('<div id="test"></div>', function (error, window) {

						assert.ifError(error)

						var expected = '<div id="test"><p></p></div>',
						    element = window.shaven(['p'])[0],
						    actual = window.shaven(
							    [getById('test', window), element]
						    )[0].outerHTML

						assert.strictEqual(actual, expected, actual)

						done()
					})
				})


				it('should return shaven object with element-ids as key', function (done) {

					testInEnv('<div id="test"></div>', function (error, window) {

						assert.ifError(error)

						var shavenObject = window.shaven(
							[getById('test', window), ['p#foo'], ['p#bar']]
						)

						assert.strictEqual(shavenObject.foo, getById('foo', window))
						assert.strictEqual(shavenObject.bar, getById('bar', window))
						done()
					})
				})


				it('should return marked elements ', function (done) {

					testInEnv('<div id="test"></div>', function (error, window) {

						assert.ifError(error)

						var shavenObject = window.shaven(
							[getById('test', window), ['a$foo'], ['p$bar']]
						)

						assert.strictEqual(
							shavenObject.foo,
							window.document.getElementsByTagName('a')[0]
						)
						assert.strictEqual(
							shavenObject.bar,
							window.document.getElementsByTagName('p')[0]
						)
						done()
					})
				})
			}


			it('should set string as textContent', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var expected = '<p>test</p>',
					    element = scope.shaven(['p', 'test'])[0]

					if (environment === 'nodejs')
						assert.strictEqual(element, expected)
					else
						assert.strictEqual(element.outerHTML, expected)

					done()
				})
			})


			it('should set number as textContent', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var expected = '<p>1234</p>',
					    element = scope.shaven(['p', 1234])[0]

					if (environment === 'nodejs')
						assert.strictEqual(element, expected)
					else
						assert.strictEqual(element.outerHTML, expected)

					done()
				})
			})


			it('should build elements recursively', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var expected = '<div><p>foo<em>bar</em></p></div>',
					    actual = scope.shaven(
						    ['div',
							    ['p', 'foo',
								    ['em', 'bar']
							    ]
						    ]
					    )[0]

					if (environment === 'nodejs')
						assert.strictEqual(actual, expected)
					else
						assert.strictEqual(actual.outerHTML, expected)

					done()
				})
			})


			it('should be possible to set properties', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var expected = '<p id="foo" class="bar" data-info="baz"></p>',
					    actual = scope.shaven(
						    ['p', {
							    id: 'foo',
							    class: 'bar',  // class is restricted word
							    'data-info': 'baz' // attribute with dash
						    }]
					    )[0]

					if (environment === 'nodejs')
						assert.strictEqual(actual, expected)
					else
						assert.strictEqual(actual.outerHTML, expected)
					done()
				})
			})


			it('should not set falsy properties', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var expected = '<p title="foo" tabindex="3" data-info=""></p>',
					    actual = scope.shaven(
						    ['p', {
							    title: 'foo',
							    tabindex: 3,
							    lang: false,
							    'data-test': null,
							    'data-info': undefined
						    }]
					    )[0]


					if (environment === 'nodejs')
						assert.strictEqual(actual, expected)

					else
						assert.strictEqual(actual.outerHTML, expected)

					done()
				})
			})


			describe('Syntax-sugar string', function () {


				it('should use div as default tag', function (done) {

					testInEnv(null, function (error, scope) {

						assert.ifError(error)

						var expected = '<div id="foo"></div>',
						    element = scope.shaven(['#foo'])[0]

						if (environment === 'nodejs')
							assert.strictEqual(element, expected)
						else
							assert.strictEqual(element.outerHTML, expected)

						done()
					})
				})


				it('should set the id', function (done) {

					testInEnv(null, function (error, scope) {

						assert.ifError(error)

						var expected = '<p id="foo-1"></p>',
						    element = scope.shaven(['p#foo-1'])[0]

						if (environment === 'nodejs')
							assert.strictEqual(element, expected)
						else
							assert.strictEqual(element.outerHTML, expected)

						done()
					})
				})


				it('should set the class', function (done) {

					testInEnv(null, function (error, scope) {

						assert.ifError(error)

						var expected = '<p class="foo"></p>',
						    element = scope.shaven(['p.foo'])[0]

						if (environment === 'nodejs')
							assert.strictEqual(element, expected)
						else
							assert.strictEqual(element.outerHTML, expected)

						done()
					})
				})


				it('should work with both class and id', function (done) {

					testInEnv(null, function (error, scope) {

						assert.ifError(error)

						var expected = '<p id="b" class="new"></p>',
						    element = scope.shaven(['p#b.new'])[0]

						if (environment === 'nodejs')
							assert.strictEqual(element, expected)
						else
							assert.strictEqual(element.outerHTML, expected)

						done()
					})
				})


				it('should work with class and id reversed', function (done) {

					testInEnv(null, function (error, scope) {

						assert.ifError(error)

						var expected = '<p id="c" class="new"></p>',
						    element = scope.shaven(['p.new#c'])[0]

						if (environment === 'nodejs')
							assert.strictEqual(element, expected)
						else
							assert.strictEqual(element.outerHTML, expected)

						done()
					})
				})


				it('should understand multiple classes and ids', function (done) {

					testInEnv(null, function (error, scope) {

						assert.ifError(error)

						var expected = '<p id="foo" class="bar baz"></p>',
						    element = scope.shaven(['p.bar#foo.baz'])[0]

						if (environment === 'nodejs')
							assert.strictEqual(element, expected)
						else
							assert.strictEqual(element.outerHTML, expected)

						done()
					})
				})
			})


			it('should call the provided callback function', function (done) {

				testInEnv('<div id="test"></div> ', function (error, scope) {

					assert.ifError(error)

					var called = false,
					    element = false,
					    shavenObject

					function foo (el) {
						called = true
						element = el
					}

					shavenObject = scope.shaven(['p#bar', foo])

					assert(called)
					assert.strictEqual(element, shavenObject[0])
					done()
				})
			})


			it('should return a shaven object and not an html element or string', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var shavenObject = scope.shaven(['p'])

					assert(typeof shavenObject === 'object')
					assert.notStrictEqual(shavenObject.nodeType, 1)
					done()
				})
			})


			it('should return the root html element by referencing [0]', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var shavenObject = scope.shaven(['p'])

					if (environment !== 'nodejs')
						assert.strictEqual(shavenObject[0].nodeType, 1)
					else
						assert.strictEqual('<p></p>', shavenObject[0])

					done()
				})
			})


			it('should escape html string', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var html = '<p>Some <strong>HTML</strong></p>',
					    element = scope.shaven(['div', html])[0]

					if (environment === 'nodejs')
						assert.strictEqual(element, '<div>' + html + '</div>')
					else
						assert.strictEqual(element.textContent, html)

					done()
				})
			})


			it('should build html from string', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var html = '<p>Some <strong>HTML</strong></p>',
					    element = scope.shaven(['div&', html])[0]

					if (environment === 'nodejs')
						assert.strictEqual(element, '<div>' + html + '</div>')
					else
						assert.strictEqual(element.innerHTML, html)

					done()
				})
			})


			if (environment !== 'jsdom')
				it('should work with SVGs', function (done) {

					testInEnv(null, function (error, scope) {

						assert.ifError(error)

						var expected = '<svg id="svg" height="10" width="10">' +
						               '<circle class="top" cx="5" cy="5" r="5" style="fill:green"></circle>' +
						               '</svg>',
						    array = ['svg#svg', {height: 10, width: 10},
							    ['circle.top', {cx: 5, cy: 5, r: 5, style: 'fill:green'}]
						    ],
						    browserSvgElement,
						    svg


						if (environment === 'nodejs')
							assert.strictEqual(scope.shaven(array)[0], expected)

						else if (environment === 'browser') {

							browserSvgElement = scope.shaven(
								[getById('test', scope), array],
								'http://www.w3.org/2000/svg'
							)[0]

							svg = getById('svg', scope)

							assert(svg.offsetWidth === 10 && svg.offsetHeight === 10)
							assert.strictEqual(browserSvgElement.innerHTML, expected)

							svg.parentNode.removeChild(svg)
						}

						done()
					})
				})

			else
			// TODO (Must fail with the wrong namespace)
				it('should work with SVGs (but only with the correct namespace)')


			describe('Falsy values', function () {

				it('should return an empty element for missing content value', function (done) {

					testInEnv(null, function (error, scope) {

						assert.ifError(error)

						var element = scope.shaven(['div'])[0]

						if (environment === 'nodejs')
							assert.strictEqual(element, '<div></div>')
						else
							assert.strictEqual(element.outerHTML, '<div></div>')

						done()
					})
				})


				it('should return an empty element for undefined content value', function (done) {

					testInEnv(null, function (error, scope) {

						assert.ifError(error)

						var element = scope.shaven(['div', undefined])[0]

						if (environment === 'nodejs')
							assert.strictEqual(element, '<div></div>')
						else
							assert.strictEqual(element.outerHTML, '<div></div>')
						done()
					})
				})


				it('should return no element if content value is "false"', function (done) {

					testInEnv(null, function (error, scope) {

						assert.ifError(error)

						var element = scope.shaven(['div', ['p', false]])[0]

						if (environment === 'nodejs')
							assert.strictEqual(element, '<div></div>')
						else
							assert.strictEqual(element.outerHTML, '<div></div>')

						done()
					})
				})


				it('should return no element if content value is "null"', function (done) {

					testInEnv(null, function (error, scope) {

						assert.ifError(error)

						var element = scope.shaven(['div', ['p', null]])[0]

						if (environment === 'nodejs')
							assert.strictEqual(element, '<div></div>')
						else
							assert.strictEqual(element.outerHTML, '<div></div>')

						done()
					})
				})
			})
		})
	}


	if (isBrowser) {

		assert = window.assert

		runTestSuite('browser')
	}
	else {

		assert = require('assert')
		shaven = require('../src/index.js')
		jsdom = require('jsdom')

		runTestSuite('jsdom')
		runTestSuite('nodejs')
	}
}()
