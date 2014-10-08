var escape = require('escape-html')

// TODO: remove namespace

module.exports = function shaven (array, namespace, returnObject) {

	'use strict'

	var HTMLString,
	    doesEscape,
	    i,
	    attributeKey,
	    callback,
	    key


	returnObject = returnObject || {}


	function createElement (sugarString) {

		var tags = sugarString.match(/^\w+/),
		    element = {
			    tag: tags ? tags[0] : 'div',
			    attr: {},
			    children: []
		    },
		    id = sugarString.match(/#([\w-]+)/),
		    reference = sugarString.match(/\$([\w-]+)/),
		    classNames = sugarString.match(/\.[\w-]+/g)


		// Assign id if is set
		if (id) {

			element.attr.id = id[1]

			// Add element to the return object
			returnObject[id[1]] = element
		}

		if (reference)
			returnObject[reference[1]] = element

		if (classNames)
			element.attr.class = classNames.join(' ').replace(/\./g, '')

		if (sugarString.match(/&$/g))
			doesEscape = false

		return element
	}

	function replacer (key, value) {

		if (value === null || value === false || value === undefined)
			return

		if (typeof value !== 'string' && typeof value !== 'object')
			return String(value)

		return value
	}

	// TODO: Create customised renderer
	// If is object
	// if (array === Object(array)) {

	// } else {

	if (typeof array[0] === 'string')
		array[0] = createElement(array[0])


	for (i = 1; i < array.length; i++) {

		// Don't render element if value is false or null
		if (array[i] === false || array[i] === null) {
			array[0] = false
			break
		}

		else if (array[i] === undefined) {
			continue
		}


		else if (typeof array[i] === 'string' || typeof array[i] === 'number') {
			if (doesEscape)
				array[i] = escape(array[i])

			array[0].children.push(array[i])
		}

		else if (Array.isArray(array[i])) {

			shaven(array[i], namespace, returnObject)

			if (array[i][0])
				array[0].children.push(array[i][0])
		}

		else if (typeof array[i] === 'function')
			callback = array[i]


		else if (typeof array[i] === 'object') {
			for (attributeKey in array[i])
				if (array[i].hasOwnProperty(attributeKey))
					if (array[i][attributeKey] !== null &&
					    array[i][attributeKey] !== false)
						if (attributeKey === 'style' &&
						    typeof array[i][attributeKey] === 'object')
							array[0].attr[attributeKey] = JSON
								.stringify(array[i][attributeKey], replacer)
								.slice(2, -2)
								.replace(/","/g, ';')
								.replace(/":"/g, ':')
								.replace(/\\"/g, '\'')

						else
							array[0].attr[attributeKey] = array[i][attributeKey]
		}

		else
			throw new TypeError('"' + array[i] + '" is not allowed as a value.')
	}
	// }

	if (array[0] !== false) {

		HTMLString = ['<', array[0].tag]

		for (key in array[0].attr)
			if (array[0].attr.hasOwnProperty(key))
				HTMLString.push(' ', key, '="', array[0].attr[key], '"')

		HTMLString.push('>')

		array[0].children.forEach(function (child) {
			HTMLString.push(child)
		})

		HTMLString.push('</', array[0].tag, '>')

		array[0] = HTMLString.join('')
	}

	// Return root element on index 0
	returnObject[0] = array[0]

	if (callback) callback(array[0])

	// returns object containing all elements with an id and the root element
	return returnObject
}
