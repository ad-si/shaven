import parseSugarString from './parseSugarString'
import stringifyStyleObject from './stringifyStyleObject'
import * as escape from './escape'


// TODO: remove namespace

module.exports = function shaven (array, namespace, returnObject) {

	let i = 1
	let escapeHTML = false
	let callback


	returnObject = returnObject || {}

	function createElement (sugarString) {
		const properties = parseSugarString(sugarString)
		const element = {
			tag: properties.tag,
			attr: {},
			children: [],
		}

		if (properties.id) {
			element.attr.id = properties.id
			returnObject[properties.id] = element
		}
		if (properties.class) {
			element.attr.class = properties.class
		}
		if (properties.reference) {
			returnObject[properties.reference] = element
		}

		escapeHTML = properties.escapeHTML

		return element
	}


	if (typeof array[0] === 'string')
		array[0] = createElement(array[0], returnObject)

	else if (Array.isArray(array[0]))
		i = 0

	else
		throw new Error(
			'First element of array must be a string, ' +
			'or an array and not ' + JSON.stringify(array[0])
		)


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

		else if (typeof array[i] === 'string') {
			if (escapeHTML)
				array[i] = escape.HTML(array[i])

			array[0].children.push(array[i])
		}

		else if (typeof array[i] === 'number') {

			array[0].children.push(array[i])
		}

		else if (Array.isArray(array[i])) {

			if (Array.isArray(array[i][0])) {
				array[i].reverse().forEach(function (subArray) {
					array.splice(i + 1, 0, subArray)
				})

				if (i !== 0)
					continue
				i++
			}

			shaven(array[i], namespace, returnObject)

			if (array[i][0])
				array[0].children.push(array[i][0])
		}

		else if (typeof array[i] === 'function')
			callback = array[i]

		else if (typeof array[i] === 'object') {
			for (let attributeKey in array[i]) {
				const attributeValue = array[i][attributeKey]

				if (array[i].hasOwnProperty(attributeKey) &&
					attributeValue !== null &&
					attributeValue !== false
				)
					if (attributeKey === 'style' &&
						typeof attributeValue === 'object'
					) {
						array[0].attr[attributeKey] =
							stringifyStyleObject(attributeValue)
					}
					else {
						array[0].attr[attributeKey] = array[i][attributeKey]
					}
			}
		}
		else
			throw new TypeError('"' + array[i] + '" is not allowed as a value.')
	}


	if (array[0] !== false) {

		let HTMLString = '<' + array[0].tag

		for (const key in array[0].attr)
			if (array[0].attr.hasOwnProperty(key))
				HTMLString += ' ' + key + '="' +
					escape.attribute(array[0].attr[key]) + '"'

		HTMLString += '>'

		array[0].children.forEach(function (child) {
			HTMLString += child
		})

		HTMLString += '</' + array[0].tag + '>'

		array[0] = HTMLString
	}

	// Return root element on index 0
	returnObject[0] = array[0]
	returnObject.rootElement = array[0]

	returnObject.toString = () => array[0]

	if (callback)
		callback(array[0])

	// returns object containing all elements with an id and the root element
	return returnObject
}
