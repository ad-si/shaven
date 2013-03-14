TestCase('Standard', {

	'test syntax-sugar id': function () {
		/*:DOC gen = <div></div>*/
		/*:DOC ref = <div><div id="test-1"></div></div>*/

		DOMinate([this.gen, ['div#test-1']]);

		assertTrue(this.gen.outerHTML + ' == ' + this.ref.outerHTML, this.gen.isEqualNode(this.ref));
	},

	'test syntax-sugar class': function () {
		/*:DOC ref = <div><a class="new"></a></div>*/
		/*:DOC gen = <div></div>*/

		DOMinate([this.gen, ['a.new']])

		assertTrue(this.gen.outerHTML + ' == ' + this.ref.outerHTML, this.gen.isEqualNode(this.ref))
	},

	'test syntax-sugar class and id': function () {
		/*:DOC ref = <div><a id="b" class="new"></a></div>*/
		/*:DOC gen = <div></div>*/

		DOMinate([this.gen, ['a#b.new']])

		assertTrue(this.gen.outerHTML + ' == ' + this.ref.outerHTML, this.gen.isEqualNode(this.ref))
	},

	'test syntax-sugar class and id reversed': function () {
		/*:DOC ref = <div><a id="c" class="new"></a></div>*/
		/*:DOC gen = <div></div>*/

		DOMinate([this.gen, ['a.new#c']])

		assertTrue(this.gen.outerHTML + ' == ' + this.ref.outerHTML, this.gen.isEqualNode(this.ref))
	},

	'test multiple syntax-sugar classes and id': function () {
		/*:DOC ref = <div><a id="c" class="new test"></a></div>*/
		/*:DOC gen = <div></div>*/

		DOMinate([this.gen, ['a.new#c.test']])

		assertTrue(this.gen.outerHTML + ' == ' + this.ref.outerHTML, this.gen.isEqualNode(this.ref))
	},

	'test callback function': function () {
		/*:DOC gen = <div></div>*/

		var bar = false,
			element = false

		function foo(el) {
			bar = true
			element = el
		}

		DOMinate([this.gen, foo])

		assertTrue('Function was called', bar)
		assertTrue('Element was passed to function', isElement_(element))
		assertSame('Correct element was passed to function', this.gen, element)
	},

	'test return element object': function () {
		/*:DOC gen = <div></div>*/

		assertObject('Should return an object', DOMinate([this.gen, ['a']]));
	},

	'test return of root element': function () {
		/*:DOC gen = <div></div>*/

		assertEquals('Should return a node of type', 1, DOMinate([this.gen, ['a']])[0].nodeType);
	},

	'test return of elements with an id': function () {
		/*:DOC += <div id="gen"></div>*/

		var fragment = DOMinate([document.getElementById('gen'), ['a#foo'], ['a#bar']])

		assertEquals('Should return element', document.getElementById('foo'), fragment.foo)
		assertEquals('Should return element', document.getElementById('bar'), fragment.bar)
	},

	'test return of marked elements ': function () {
		/*:DOC += <div id="gen"></div>*/

		var fragment = DOMinate([document.getElementById('gen'), ['a$foo'], ['p$bar']])

		assertEquals('Should return element', document.getElementsByTagName('a')[0], fragment.foo)
		assertEquals('Should return element', document.getElementsByTagName('p')[0], fragment.bar)
	}
})