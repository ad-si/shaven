function getById(id, window) {
	return window.document.getElementById(id)
}

function runTestSuite(environment) {

	function testInEnv(html, callback) {

		if (environment === 'browser')
			callback(null, window)

		else if (environment === 'jsdom')
			jsdom.env({
				html: html === null ? '<div></div>' : html,
				scripts: ['../src/shaven.js'],
				done: callback
			})

		else if (environment === 'nodejs') {
			//TODO
		}

	}

	afterEach(function () {

		if (environment === 'browser')
			getById('test', window).innerHTML = ''
	})


	describe('Shaven in environment: ' + environment, function () {

		if (environment === 'browser' || environment === 'jsdom') {


			it('should be attachable to elements', function (done) {

				testInEnv('<div id="test"></div>', function (error, window) {

					assert.ifError(error)

					var expected = '<div id="test"><p></p></div>',
						actual = window.shaven([getById('test', window), ['p']])[0].outerHTML

					assert.strictEqual(actual, expected, actual)

					done()
				})
			})


			it('should append html elements', function (done) {

				testInEnv('<div id="test"></div>', function (error, window) {

					assert.ifError(error)

					var expected = '<div id="test"><p>foo</p></div>',
						element = window.shaven(['p', 'foo'])[0],
						actual = window.shaven([getById('test', window), element])[0].outerHTML

					assert.strictEqual(actual, expected, actual)

					done()
				})
			})


			it('should return shaven object with element-ids as key', function (done) {

				testInEnv('<div id="test"></div>', function (error, window) {

					assert.ifError(error)

					var shavenObject = window.shaven([getById('test', window), ['p#foo'], ['p#bar']])

					assert.strictEqual(shavenObject.foo, getById('foo', window))
					assert.strictEqual(shavenObject.bar, getById('bar', window))
					done()
				})
			})


			it('should return marked elements ', function (done) {

				testInEnv('<div id="test"></div>', function (error, window) {

					assert.ifError(error)

					var shavenObject = window.shaven([getById('test', window), ['a$foo'], ['p$bar']])

					assert.strictEqual(shavenObject.foo, window.document.getElementsByTagName('a')[0])
					assert.strictEqual(shavenObject.bar, window.document.getElementsByTagName('p')[0])
					done()
				})
			})
		}


		it('should build elements recursively', function (done) {

			testInEnv(null, function (error, window) {

				assert.ifError(error)

				var expected = '<div><p>foo<em>bar</em></p></div>',
					actual = window.shaven(
						['div',
							['p', 'foo',
								['em', 'bar']
							]
						]
					)[0].outerHTML

				assert.strictEqual(actual, expected)
				done()
			})
		})


		it('should be possible to set properties', function (done) {

			testInEnv(null, function (error, window) {

				assert.ifError(error)

				var expected = '<p id="foo" class="bar" data-info="baz"></p>',
					actual = window.shaven(
						['p', {
							id: 'foo',
							class: 'bar',  // class is restricted word
							'data-info': 'baz' // attribute with dash
						}]
					)[0].outerHTML

				assert.strictEqual(actual, expected)
				done()
			})
		})


		describe('Syntax-sugar string', function () {

			it('should set the id', function (done) {

				testInEnv(null, function (error, window) {

					assert.ifError(error)

					var expected = '<p id="foo-1"></p>',
						actual = window.shaven(['p#foo-1'])[0].outerHTML

					assert.strictEqual(actual, expected)
					done()
				})
			})


			it('should set the class', function (done) {

				testInEnv(null, function (error, window) {

					assert.ifError(error)

					var expected = '<p class="foo"></p>',
						actual = window.shaven(['p.foo'])[0].outerHTML

					assert.strictEqual(actual, expected)
					done()
				})
			})


			it('should work with both class and id', function (done) {

				testInEnv(null, function (error, window) {

					assert.ifError(error)

					var expected = '<p id="b" class="new"></p>',
						actual = window.shaven(['p#b.new'])[0].outerHTML

					assert.strictEqual(actual, expected)
					done()
				})
			})


			it('should work with class and id reversed', function (done) {

				testInEnv(null, function (error, window) {

					assert.ifError(error)

					var expected = '<p id="c" class="new"></p>',
						actual = window.shaven(['p.new#c'])[0].outerHTML

					assert.strictEqual(actual, expected)
					done()
				})
			})


			it('should understand multiple classes and ids', function (done) {

				testInEnv(null, function (error, window) {

					assert.ifError(error)

					var expected = '<p id="foo" class="bar baz"></p>',
						actual = window.shaven(['p.bar#foo.baz'])[0].outerHTML

					assert.strictEqual(actual, expected)
					done()
				})
			})
		})


		it('should call the provided callback function', function (done) {

			testInEnv('<div id="test"></div> ', function (error, window) {

				assert.ifError(error)

				var called = false,
					element = false,
					shavenObject

				function foo(el) {
					called = true
					element = el
				}

				shavenObject = window.shaven(['p#bar', foo])

				assert(called)
				assert.strictEqual(element, shavenObject[0])
				done()
			})
		})


		it('should return a shaven object and not an html element or string', function (done) {

			testInEnv(null, function (error, window) {

				assert.ifError(error)

				var shavenObject = window.shaven(['p'])

				assert(typeof shavenObject === 'object')
				assert.notStrictEqual(shavenObject.nodeType, 1)
				done()
			})
		})


		it('should return the root html element', function (done) {

			testInEnv(null, function (error, window) {

				assert.ifError(error)

				var shavenObject = window.shaven(['p'])

				assert.strictEqual(shavenObject[0].nodeType, 1)
				done()
			})
		})


		it('should escape html string', function (done) {

			testInEnv(null, function (error, window) {

				assert.ifError(error)

				var html = '<p>Some <strong>HTML</strong></p>',
					actualInBrowser = window.shaven(['div', html])[0].textContent,
					actualInServer = window.shaven(['div', html])[0]

				if (environment === 'nodejs')
					assert.strictEqual(actualInServer, html)
				else
					assert.strictEqual(actualInBrowser, html)

				done()
			})
		})


		it('should build html from string', function (done) {

			testInEnv(null, function (error, window) {

				assert.ifError(error)

				var html = '<p>Some <strong>HTML</strong></p>',
					actual = window.shaven(['div&', html])[0].innerHTML

				assert.strictEqual(actual, html)
				done()
			})
		})


		it.skip('should work with SVGs (but only with the correct namespace)', function (done) {

			testInEnv(null, function (error, window) {


				// TODO: Make it fail with the wrong namespace

				assert.ifError(error)

				var expected = '<svg height="100" width="100">' +
						'<circle class="top" cx="10" cy="10" r="5" style="fill:green"></circle></svg>',
					actual = window.shaven(
						[getById('test', window),
							['svg#svg', {height: 100, width: 100},
								['circle.top', {cx: 10, cy: 10, r: 5, style: 'fill:green'}]
							]
						],
						'http://www.w3.org/2000/svg'
					)[0].innerHTML

				assert.strictEqual(actual, expected)
				done()
			})
		})


		describe('Falsy values', function () {

			it('should return an empty element for missing content value', function (done) {

				testInEnv(null, function (error, window) {

					assert.ifError(error)

					var actual = window.shaven(['div'])[0].outerHTML

					assert.strictEqual(actual, '<div></div>')
					done()
				})
			})


			it('should return an empty element for undefined content value', function (done) {

				testInEnv(null, function (error, window) {

					assert.ifError(error)

					var actual = window.shaven(['div', undefined])[0].outerHTML

					assert.strictEqual(actual, '<div></div>')
					done()
				})
			})


			it('should return no element if content value is "false"', function (done) {

				testInEnv(null, function (error, window) {

					assert.ifError(error)

					var actual = window.shaven(['div', ['p', false]])[0].outerHTML

					assert.strictEqual(actual, '<div></div>')
					done()
				})
			})


			it('should return no element if content value is "null"', function (done) {

				testInEnv(null, function (error, window) {

					assert.ifError(error)

					var actual = window.shaven(['div', ['p', null]])[0].outerHTML

					assert.strictEqual(actual, '<div></div>')
					done()
				})
			})
		})
	})
}


var isBrowser = (typeof window !== 'undefined')


if (isBrowser)
	runTestSuite('browser')

else {

	var assert = require('assert'),
		shaven = require('../src/index.js'),
		jsdom = require('jsdom')

	//runTestSuite('nodejs')
	runTestSuite('jsdom')
}
