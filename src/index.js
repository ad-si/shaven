var jsdom = require('jsdom')

module.exports = function(array, namespace, returnObject){

	var shavenObject

	jsdom.env({
		html: '<div id="container"></div>',
		scripts: ['./shaven.js'],
		done: function (error, window) {

			if (error) throw error

			shavenObject = window.shaven(array, namespace, returnObject)

			shavenObject[0] = shavenObject[0].outerHTML
		}
	})

	while(shavenObject === undefined);

	return shavenObject
}
