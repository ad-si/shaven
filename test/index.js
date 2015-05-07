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


				it('attaches to elements', function (done) {

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


				it('appends html elements', function (done) {

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


				it('returns a shaven object with element-ids as keys', function (done) {

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


				it('returns marked elements ', function (done) {

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


			it('sets a string as textContent', function (done) {

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


			it('sets a number as textContent', function (done) {

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


			it('builds elements recursively', function (done) {

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


			it('is possible to set properties', function (done) {

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


			it('does not set falsy properties', function (done) {

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


			it('builds a string from a style object', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var expected = '<p style="color:rgb(255,0,0);font-size:10;' +
					               'font-family:Arial, \'Helvetica Neue\', ' +
					               'sans-serif"></p>',
					    actual = scope.shaven(
						    ['p', {
							    style: {
								    color: 'rgb(255,0,0)',
								    'font-size': 10,
								    'font-family': 'Arial, "Helvetica Neue", sans-serif'
							    }
						    }]
					    )[0]


					if (environment === 'nodejs')
						assert.strictEqual(actual, expected)

					else
						assert.strictEqual(actual.outerHTML, expected)

					done()
				})
			})


			it('does not include falsy values in style string', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var expected = '<p style="color:red"></p>',
					    actual = scope.shaven(
						    ['p', {
							    style: {
								    color: 'red',
								    border: false,
								    'background-color': null,
								    visibility: undefined
							    }
						    }]
					    )[0]


					if (environment === 'nodejs')
						assert.strictEqual(actual, expected)

					else
						assert.strictEqual(actual.outerHTML, expected)

					done()
				})
			})


			it('does ignore "true" values', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var expected = '<p>test</p>',
					    element = scope.shaven(['p', 'test', true])[0]

					if (environment === 'nodejs')
						assert.strictEqual(element, expected)
					else
						assert.strictEqual(element.outerHTML, expected)

					done()
				})
			})



			describe('Syntax-sugar string', function () {


				it('uses div as default tag', function (done) {

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


				it('sets the id', function (done) {

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


				it('sets the class', function (done) {

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


				it('works with both class and id', function (done) {

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


				it('works with class and id reversed', function (done) {

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


				it('understands multiple classes and ids', function (done) {

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


			it('calls the provided callback function', function (done) {

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


			it('returns a shaven object and not an html element or string', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var shavenObject = scope.shaven(['p'])

					assert(typeof shavenObject === 'object')
					assert.notStrictEqual(shavenObject.nodeType, 1)
					done()
				})
			})


			it('returns the root html element by referencing [0]', function (done) {

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


			it('escapes html strings in tags', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var html = '<p>Some <strong>HTML</strong></p>',
						escapedHtml = '&lt;p&gt;Some ' +
							'&lt;strong&gt;HTML&lt;/strong&gt;' +
							'&lt;/p&gt;',
					    element = scope.shaven(['div', html])[0]

					if (environment === 'nodejs')
						assert.strictEqual(
							element,
							'<div>' + escapedHtml + '</div>'
						)
					else
						assert.strictEqual(element.innerHTML, escapedHtml)

					done()
				})
			})


			it('escapes html strings in attributes', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var escapedHtml =
							'<p ' +
							'title="&quot; &amp;" ' +
							'lang="\' < >"' +
							'>' +
							'Test' +
							'</p>',
						element = scope.shaven(
							['p', 'Test', {
								title: '" &',
								lang: '\' < >'
							}]
						)[0]

					if (environment === 'nodejs')
						assert.strictEqual(element, escapedHtml)
					else
						assert.strictEqual(element.outerHTML, escapedHtml)

					done()
				})
			})


			it('builds html from strings', function (done) {

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


			it('accepts an array of elements', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var html = '<p>Numbers: ' +
							'<span>1</span>' +
							'<span>2</span>' +
							'<span>3</span>' +
							'<span>4</span>' +
							'<span>5</span>' +
							'</p>',
						element = scope.shaven(['p', 'Numbers: ', [
							['span', '1'],
							['span', '2'],
							['span', '3'],
							[
								['span', '4'],
								['span', '5']
							]
						]])[0]

					if (environment === 'nodejs')
						assert.strictEqual(element, html)
					else
						assert.strictEqual(element.outerHTML, html)

					done()
				})
			})

			it('accepts an array of elements at index 0', function (done) {

				testInEnv(null, function (error, scope) {

					assert.ifError(error)

					var html = '<p>Numbers: ' +
							'<span>1</span>' +
							'<span>2</span>' +
							'<span>3</span>' +
							'</p>',
						element = scope.shaven(['p', 'Numbers: ', [
							[
								['span', '1'],
								['span', '2'],
								['span', '3']
							]
						]])[0]

					if (environment === 'nodejs')
						assert.strictEqual(element, html)
					else
						assert.strictEqual(element.outerHTML, html)

					done()
				})
			})

			it('throws an error for an invalid array', function (done) {

				testInEnv(null, function (error, scope) {

					var regexString = '.*first element.*must be.*string.*array.*'

					assert.ifError(error)

					assert.throws(
						function () {
							scope.shaven([{key: 'value'}])
						},
						new RegExp(regexString, 'gi')
					)

					assert.throws(
						function () {
							scope.shaven([144, 'span', 'text'])
						},
						new RegExp(regexString, 'gi')
					)

					done()
				})
			})


			if (environment !== 'jsdom')
				it('works with SVGs', function (done) {

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

				it('returns an empty element for missing content value', function (done) {

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


				it('returns an empty element for undefined content value', function (done) {

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


				it('returns no element if content value is "false"', function (done) {

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


				it('returns no element if content value is "null"', function (done) {

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

		runTestSuite('nodejs')
		runTestSuite('jsdom')
	}
}()
