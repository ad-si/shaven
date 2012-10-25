TestCase('Standard', {
	'test return of DOM element': function () {
		/*:DOC gen = <div></div>*/

		assertEquals('Should return a node of type', 1, DOMinate([this.gen, ['a']]).nodeType);
	},

	'test syntax-sugar id': function () {
		/*:DOC gen = <div></div>*/
		/*:DOC ref = <div><div id="test"></div></div>*/

		DOMinate([this.gen, ['div#test']]);

		assertTrue(this.gen.outerHTML + ' == ' + this.ref.outerHTML, this.gen.isEqualNode(this.ref));
	}
});