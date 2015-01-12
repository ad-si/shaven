// Shaven 0.6.2 by Adrian Sieber (adriansieber.com)


// array: Array containing the DOM fragment in JsonML
// returnObject: Contains elements identified by their id

//IE7 isArray Prototype Method
if(typeof Array.isArray==='undefined')
{
	Array.isArray=(function(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	});
}
shaven = function dom (array, namespace, returnObject) {

	'use strict'

	var doc = document,
	    unescaped,
	    callback,
	    attributeKey,
	    i


	// Set on first iteration
	returnObject = returnObject || {}

	// Set default namespace to XHTML namespace
	namespace = namespace || 'http://www.w3.org/1999/xhtml'

	// Create DOM element from syntax sugar string
	function createElement (sugarString) {

		var tags = sugarString.match(/^\w+/),
		    tag = tags ? tags[0] : 'div',
			id = sugarString.match(/#([\w-]+)/),
		    ref = sugarString.match(/\$([\w-]+)/),
		    classNames = sugarString.match(/\.[\w-]+/g),
		    element = typeof doc.createElementNS == 'undefined'?doc.createElement(tag):doc.createElementNS(namespace, tag);

		// Assign id if is set
		if (id) {

			element.id = id[1]

			// Add element to the return object
			returnObject[id[1]] = element
		}

		// Create reference to the element and add it to the return object
		if (ref)
			returnObject[ref[1]] = element

		// Assign class if is set
		if (classNames)
		{
			element.setAttribute(
				'class',
				classNames.join(' ').replace(/\./g, '')
			)
			element.className=classNames.join(' ').replace(/\./g, '');
		}

		// Don't escape HTML content
		if (sugarString.match(/&$/g))
			unescaped = true

		// Return DOM element
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

	// If is string create DOM element else is already a DOM element
	if (typeof array[0] === 'string')
		array[0] = createElement(array[0])

	// For each in the element array (except the first)
	for (i = 1; i < array.length; i++) {

		// Don't render element if value is false or null
		if (array[i] === false || array[i] === null) {
			array[0] = false
			break
		}

		// Continue with next array value if current value is undefined or true
		else if (array[i] === undefined || array[i] === true) {
			continue
		}

		// If is string has to be content so set it
		else if (typeof array[i] === 'string' || typeof array[i] === 'number')
			if (unescaped)
				array[0].innerHTML = array[i]

			else
				array[0].appendChild(doc.createTextNode(array[i]))

		// If is array has to be child element
		else if (Array.isArray(array[i])) {

			// Use shaven recursively for all child elements
			dom(array[i], namespace, returnObject)

			// Append the element to its parent element
			if (array[i][0])
				array[0].appendChild(array[i][0])
		}

		else if (typeof array[i] === 'function')
			callback = array[i]

		// If it is an element append it
		else if (array[i].nodeType==3)
			array[0].appendChild(array[i])

		// Else must be an object with attributes
		else if (typeof array[i] === 'object') {
			// For each attribute
			for (attributeKey in array[i])
				if (array[i].hasOwnProperty(attributeKey)) {

					if (array[i][attributeKey] !== null &&
					    array[i][attributeKey] !== false)
						if (array[i][attributeKey] === undefined)
							array[0].setAttribute(attributeKey, '')

						else {
							if (attributeKey === 'style' &&
							    typeof array[i][attributeKey] === 'object')

								array[0].setAttribute(
									attributeKey,
									JSON
										.stringify(array[i][attributeKey], replacer)
										.slice(2, -2)
										.replace(/","/g, ';')
										.replace(/":"/g, ':')
										.replace(/\\"/g, '\'')
								)
							else if(attributeKey==='class')
							{
								array[0].className=array[i][attributeKey];
							}
							else
								array[0].setAttribute(
									attributeKey,
									array[i][attributeKey]
								)
						}
				}
		}
		else
			throw new TypeError('"' + array[i] + '" is not allowed as a value.')
	}
	// }

	// Return root element on index 0
	returnObject[0] = array[0]

	if (callback)
		callback(array[0])

	// returns object containing all elements with an id and the root element
	return returnObject
}