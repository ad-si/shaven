var assert = require('assert'),
	jsdom = require('jsdom')


function getById(id, window) {
	return window.document.getElementById(id)
}

function testInDom(html, callback) {

	jsdom.env({
		html: html,
		scripts: ['../src/shaven.js'],
		done: callback
	})
}


describe('Shaven', function () {

	it('should be attachable to elements', function (done) {

		testInDom('<div id="test"></div>', function (error, window) {

			assert.ifError(error)

			var expected = '<div id="test"><p></p></div>',
				actual = window.shaven([getById('test', window), ['p']])[0].outerHTML

			assert.strictEqual(actual, expected)

			done()
		})
	})


	it('should build elements recursively', function (done) {

		testInDom('<div id="test"></div>', function (error, window) {

			assert.ifError(error)

			var expected = '<div id="test"><div><p>foo<em>bar</em></p></div></div>',
				actual = window.shaven(
					[getById('test', window),
						['div',
							['p', 'foo',
								['em', 'bar']
							]
						]
					]
				)[0].outerHTML

			assert.strictEqual(actual, expected)
			done()
		})
	})


	it('should be possible to set properties', function (done) {

		testInDom('<div id="test"></div>', function (error, window) {

			assert.ifError(error)

			var expected = '<div id="test"><p id="foo" class="bar" data-info="baz"></p></div>',
				actual = window.shaven(
					[getById('test', window),
						['p', {
							id: 'foo',
							class: 'bar',  // class is restricted word
							'data-info': 'baz' // attribute with dash
						}]
					]
				)[0].outerHTML

			assert.strictEqual(actual, expected)
			done()
		})
	})


	describe('Syntax-sugar string', function () {

		it('should set the id', function (done) {

			testInDom('<div id="test"></div>', function (error, window) {

				assert.ifError(error)

				var expected = '<div id="test"><div id="foo-1"></div></div>',
					actual = window.shaven([getById('test', window), ['div#foo-1']])[0].outerHTML

				assert.strictEqual(actual, expected)
				done()
			})
		})


		it('should set the class', function (done) {

			testInDom('<div id="test"></div>', function (error, window) {

				assert.ifError(error)

				var expected = '<div id="test"><p class="foo"></p></div>',
					actual = window.shaven([getById('test', window), ['p.foo']])[0].outerHTML

				assert.strictEqual(actual, expected)
				done()
			})
		})


		it('should work with both class and id', function (done) {

			testInDom('<div id="test"></div>', function (error, window) {

				assert.ifError(error)

				var expected = '<div id="test"><a id="b" class="new"></a></div>',
					actual = window.shaven([getById('test', window), ['a#b.new']])[0].outerHTML

				assert.strictEqual(actual, expected)
				done()
			})
		})


		it('should work with class and id reversed', function (done) {

			testInDom('<div id="test"></div>', function (error, window) {

				assert.ifError(error)

				var expected = '<div id="test"><a id="c" class="new"></a></div>',
					actual = window.shaven([getById('test', window), ['a.new#c']])[0].outerHTML

				assert.strictEqual(actual, expected)
				done()
			})
		})


		it('should understand multiple classes and ids', function (done) {

			testInDom('<div id="test"></div>', function (error, window) {

				assert.ifError(error)

				var expected = '<div id="test"><a id="foo" class="bar baz"></a></div>',
					actual = window.shaven([getById('test', window), ['a.bar#foo.baz']])[0].outerHTML

				assert.strictEqual(actual, expected)
				done()
			})
		})
	})


	it('should call the provided callback function', function (done) {

		testInDom('<div id="test"></div>', function (error, window) {

			assert.ifError(error)

			var called = false,
				element = false

			function foo(el) {
				called = true
				element = el
			}

			window.shaven([getById('test', window), ['p#bar', foo]])

			assert(called)
			assert.strictEqual(element, getById('bar', window))
			done()
		})
	})


	it('should append html elements', function (done) {

		testInDom('<div id="test"></div>', function (error, window) {

			assert.ifError(error)

			var expected = '<div id="test"><p>foo</p></div>',
				element = window.shaven(['p', 'foo'])[0],
				actual = window.shaven([getById('test', window), element])[0].outerHTML

			assert.strictEqual(actual, expected)
			done()
		})
	})


	it('should return a shaven object and not an html element', function (done) {

		testInDom('<div id="test"></div>', function (error, window) {

			assert.ifError(error)

			assert(!window.shaven([getById('test', window), ['p']]).nodeType)
			done()
		})
	})


	it('should return the root html element', function (done) {

		testInDom('<div id="test"></div>', function (error, window) {

			assert.ifError(error)

			assert.strictEqual(window.shaven([getById('test', window), ['p']])[0].nodeType, 1)
			done()
		})
	})


	it('should return shaven object with element-ids as key', function (done) {

		testInDom('<div id="test"></div>', function (error, window) {

			assert.ifError(error)

			var shavenObject = window.shaven([getById('test', window), ['p#foo'], ['p#bar']])

			assert.strictEqual(shavenObject.foo, getById('foo', window))
			assert.strictEqual(shavenObject.bar, getById('bar', window))
			done()
		})
	})


	it('should return marked elements ', function (done) {

		testInDom('<div id="test"></div>', function (error, window) {

			assert.ifError(error)

			var shavenObject = window.shaven([getById('test', window), ['a$foo'], ['p$bar']])

			assert.strictEqual(shavenObject.foo, window.document.getElementsByTagName('a')[0])
			assert.strictEqual(shavenObject.bar, window.document.getElementsByTagName('p')[0])
			done()
		})
	})


	it('should escape html string', function (done) {

		testInDom('<div id="test"></div>', function (error, window) {

			assert.ifError(error)

			var html = '<p>Some <strong>HTML</strong></p>',
				actual = window.shaven([getById('test', window), ['div', html]])[0].textContent

			assert.strictEqual(actual, html)
			done()
		})
	})


	it('should not escape html string', function (done) {

		testInDom('<div id="test"></div>', function (error, window) {

			assert.ifError(error)

			var html = '<p>Some <strong>HTML</strong></p>',
				actual = window.shaven([getById('test', window), ['div&', html]])[0].innerHTML

			assert.strictEqual(actual, '<div>' + html + '</div>')
			done()
		})
	})


	it.skip('should work with SVGs (but only with the correct namespace)', function (done) {

		testInDom('<div id="test"></div>', function (error, window) {


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

			testInDom('<div id="test"></div>', function (error, window) {

				assert.ifError(error)

				var actual = window.shaven([getById('test', window), ['div']])[0].innerHTML

				assert.strictEqual(actual, '<div></div>')
				done()
			})
		})


		it('should return an empty element for undefined content value', function (done) {

			testInDom('<div id="test"></div>', function (error, window) {

				assert.ifError(error)

				var actual = window.shaven([getById('test', window), ['div', undefined]])[0].innerHTML

				assert.strictEqual(actual, '<div></div>')
				done()
			})
		})


		it('should return no element if content value is "false"', function (done) {

			testInDom('<div id="test"></div>', function (error, window) {

				assert.ifError(error)

				var actual = window.shaven([getById('test', window), ['div', false]])[0].outerHTML

				assert.strictEqual(actual, '<div id="test"></div>')
				done()
			})
		})


		it('should return no element if content value is "null"', function (done) {

			testInDom('<div id="test"></div>', function (error, window) {

				assert.ifError(error)

				var actual = window.shaven([getById('test', window), ['div', null]])[0].outerHTML

				assert.strictEqual(actual, '<div id="test"></div>')
				done()
			})
		})
	})
})
