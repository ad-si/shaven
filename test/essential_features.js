TestCase('Essential', {

	'test attachment to element': function () {
		/*:DOC gen = <div></div>*/
		/*:DOC ref = <div><div></div></div>*/

		shaven([this.gen, ['div']]);

		assertTrue(this.gen.outerHTML + ' == ' + this.ref.outerHTML, this.gen.isEqualNode(this.ref));
	},

	'test recursive building of Elements': function () {
		/*:DOC gen = <div></div>*/
		/*:DOC ref = <div><div><p>test<a>2</a></p></div></div>*/

		shaven(
			[this.gen,
				['div',
					['p', 'test',
						['a', '2']
					]
				]
			]
		);

		assertTrue(this.gen.outerHTML + ' == ' + this.ref.outerHTML, this.gen.isEqualNode(this.ref));
	},

	'test setting of Properties': function () {
		/*:DOC gen = <div></div>*/
		/*:DOC ref = <div><div id="important" class="test" data-info='none'></div></div>*/

		shaven(
			[this.gen,
				['div', {
					id: 'important',
					class: 'test', // class is restricted word
					'data-info': 'none' // attribute with dash
				}]
			]
		);

		assertTrue(this.gen.outerHTML + ' == ' + this.ref.outerHTML, this.gen.isEqualNode(this.ref));
	}
})

// TODO: rewrite with mocha