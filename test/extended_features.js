var reference, a, b, c,
	bo = document.body;

TestCase('Extended', {
	'test syntax-sugar class': function () {
		/*:DOC ref = <div><a class="new"></a></div>*/
		/*:DOC gen = <div></div>*/

		DOMinate([this.gen, ['a.new']]);

		assertTrue(this.gen.outerHTML + ' == ' + this.ref.outerHTML, this.gen.isEqualNode(this.ref));
	},

	'test syntax-sugar class and id': function () {
		/*:DOC ref = <div><a id="b" class="new"></a></div>*/
		/*:DOC gen = <div></div>*/

		DOMinate([this.gen, ['a#b.new']]);

		assertTrue(this.gen.outerHTML + ' == ' + this.ref.outerHTML, this.gen.isEqualNode(this.ref));
	},

	'test syntax-sugar class and id reversed': function () {
		/*:DOC ref = <div><a id="c" class="new"></a></div>*/
		/*:DOC gen = <div></div>*/

		DOMinate([this.gen, ['a.new#c']]);

		console.log(this.gen, this.ref);

		assertTrue(this.gen.outerHTML + ' == ' + this.ref.outerHTML, this.gen.isEqualNode(this.ref));
	}
});