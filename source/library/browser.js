import parseSugarString from './parseSugarString'
import stringifyStyleObject from './stringifyStyleObject'
import defaults from './defaults'
import namespaceToURL from './namespaceToURL'
import mapAttributeValue from './mapAttributeValue'


export default function shaven (arrayOrObject) {

	if (!arrayOrObject || typeof arrayOrObject !== 'object') {
		throw new Error(
			'Argument must be either an array or an object ' +
			'and not ' + arrayOrObject
		)
	}

	let config = {}
	let array

	if (Array.isArray(arrayOrObject)) {
		array = arrayOrObject
	}
	else {
		array = arrayOrObject.elementArray
		delete arrayOrObject.elementArray
		Object.assign(config, arrayOrObject)
	}


	config = Object.assign(
		{},
		defaults,
		config,
		{
			returnObject: { // Shaven object to return at last
				ids: {},
				references: {},
			},
		}
	)

	config.nsStack = [config.namespace] // Stack with current namespaces


	function createElement (sugarString) {
		const properties = parseSugarString(sugarString)
		const currentNs = config.nsStack[config.nsStack.length - 1]

		if (properties.tag === 'svg') {
			config.nsStack.push('svg')
		}
		else if (properties.tag === 'math') {
			config.nsStack.push('mathml')
		}
		else if (properties.tag === 'html') {
			config.nsStack.push('xhtml')
		}
		else { // Keep current namespace
			config.nsStack.push(currentNs)
		}

		const namespace = config.nsStack[config.nsStack.length - 1]
		const element = document.createElementNS(
			(namespaceToURL[namespace] ? namespaceToURL[namespace] : namespace),
			properties.tag
		)

		if (properties.id) {
			element.id = properties.id
			console.assert(
				!config.returnObject.ids.hasOwnProperty(properties.id),
				`Ids must be unique and "${properties.id}" is already assigned`
			)
			config.returnObject.ids[properties.id] = element
		}
		if (properties.class) {
			element.className = properties.class
		}
		if (properties.reference) {
			console.assert(
				!config.returnObject.ids.hasOwnProperty(properties.reference),
				`References must be unique and "${properties.id
					}" is already assigned`
			)
			config.returnObject.references[properties.reference] = element
		}

		if (properties.escapeHTML != null) {
			config.escapeHTML = properties.escapeHTML
		}

		return element
	}


	function buildDom (array) {

		let i = 1
		let callback

		if (typeof array[0] === 'string') {
			array[0] = createElement(array[0])
		}
		else if (Array.isArray(array[0])) {
			i = 0
		}
		else if (!(array[0] instanceof Element)) {
			throw new Error(
				'First element of array must be either a string, ' +
				'an array or a DOM element and not ' + JSON.stringify(array[0])
			)
		}


		// For each in the element array (except the first)
		for (; i < array.length; i++) {

			// Don't render element if value is false or null
			if (array[i] === false || array[i] === null) {
				array[0] = false
				break
			}

			// Continue with next array value if current is undefined or true
			else if (array[i] === undefined || array[i] === true) {
				continue
			}

			// If is string has to be content so set it
			else if (typeof array[i] === 'string' ||
				typeof array[i] === 'number'
			) {
				if (config.escapeHTML)
					array[0].appendChild(document.createTextNode(array[i]))
				else
					array[0].innerHTML = array[i]
			}

			// If is array has to be child element
			else if (Array.isArray(array[i])) {
				// If is actually a sub-array, flatten it
				if (Array.isArray(array[i][0])) {
					array[i].reverse().forEach(function (subArray) {
						array.splice(i + 1, 0, subArray)
					})

					if (i !== 0)
						continue
					i++
				}

				// Build dom recursively for all child elements
				buildDom(array[i])

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
						array[0].setAttribute(
							attributeKey,
							mapAttributeValue(
								attributeKey,
								attributeValue,
								config
							)
						)
					}
				}
			}
			else {
				throw new TypeError(`"${array[i]}" is not allowed as a value`)
			}
		}



		config.nsStack.pop()

		// Return root element on index 0
		config.returnObject[0] = array[0]
		config.returnObject.rootElement = array[0]

		config.returnObject.toString = () => array[0].outerHTML

		if (callback)
			callback(array[0])
	}


	buildDom(array)

	return config.returnObject
}

shaven.setDefaults = (object) => {
	Object.assign(defaults, object)
	return shaven
}
