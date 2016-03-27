import parseSugarString from './parseSugarString'
import stringifyStyleObject from './stringifyStyleObject'

// array: Array containing the DOM fragment in JsonML
// returnObject: Contains elements identified by their id

export default function dom (array, namespace, returnObject) {

	'use strict'

	let i = 1
	let escapeHTML = false
	let callback

	// Set on first iteration
	returnObject = returnObject || {}

	// Set default namespace to XHTML namespace
	namespace = namespace || 'http://www.w3.org/1999/xhtml'

	function createElement (sugarString) {
		const properties = parseSugarString(sugarString)
		const element = document.createElementNS(namespace, properties.tag)

		if (properties.id) {
			element.id = properties.id
			returnObject[properties.id] = element
		}
		if (properties.class) {
			element.className = properties.class
		}
		if (properties.reference) {
			returnObject[properties.reference] = element
		}

		escapeHTML = properties.escapeHTML

		return element
	}


	if (typeof array[0] === 'string')
		array[0] = createElement(array[0])

	else if (Array.isArray(array[0]))
		i = 0

	else if (!(array[0] instanceof Element))
		throw new Error(
			'First element of array must be either a string, ' +
			'an array or a DOM element and not ' + JSON.stringify(array[0])
		)


	// For each in the element array (except the first)
	for (; i < array.length; i++) {

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
		else if (typeof array[i] === 'string' || typeof array[i] === 'number') {
			if (escapeHTML)
				array[0].appendChild(document.createTextNode(array[i]))
			else
				array[0].innerHTML = array[i]
		}

		// If is array has to be child element
		else if (Array.isArray(array[i])) {

			if (Array.isArray(array[i][0])) {
				array[i].reverse().forEach(function (subArray) {
					array.splice(i + 1, 0, subArray)
				})

				if (i !== 0)
					continue
				i++
			}

			// Use shaven recursively for all child elements
			dom(array[i], namespace, returnObject)

			// Append the element to its parent element
			if (array[i][0]) {
				array[0].appendChild(array[i][0])
			}
		}

		else if (typeof array[i] === 'function')
			callback = array[i]

		// If it is an element append it
		else if (array[i] instanceof Element)
			array[0].appendChild(array[i])

		// Else must be an object with attributes
		else if (typeof array[i] === 'object') {
			// For each attribute
			for (let attributeKey in array[i]) {
				const attributeValue = array[i][attributeKey]

				if (array[i].hasOwnProperty(attributeKey) &&
					attributeValue !== null &&
					attributeValue !== false
				) {
					if (attributeValue === undefined)
						array[0].setAttribute(attributeKey, '')

					else {
						if (attributeKey === 'style' &&
							typeof attributeValue === 'object'
						) {
							array[0].setAttribute(
								'style',
								stringifyStyleObject(attributeValue)
							)
						}
						else
							array[0].setAttribute(attributeKey, attributeValue)
					}
				}
			}
		}
		else
			throw new TypeError('"' + array[i] + '" is not allowed as a value.')
	}


	// Return root element on index 0
	returnObject[0] = array[0]
	returnObject.rootElement = array[0]

	returnObject.toString = () => array[0].outerHTML

	if (callback)
		callback(array[0])

	// returns object containing all elements with an id and the root element
	return returnObject
}
