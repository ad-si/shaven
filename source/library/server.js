import parseSugarString from './parseSugarString'
import stringifyStyleObject from './stringifyStyleObject'
import * as escape from './escape'
import defaults from './defaults'


export default function shaven (array) {

	const config = {
		returnObject: { // Shaven object to return at last
			ids: {},
			references: {},
		},
		escapeHTML: defaults.escapeHTML,
	}


	function createElement (sugarString) {
		const properties = parseSugarString(sugarString)
		const element = {
			tag: properties.tag,
			attr: {},
			children: [],
		}

		if (properties.id) {
			element.attr.id = properties.id
			console.assert(
				!config.returnObject.ids.hasOwnProperty(properties.id),
				`Ids must be unique and "${properties.id}" is already assigned`
			)
			config.returnObject.ids[properties.id] = element
		}
		if (properties.class) {
			element.attr.class = properties.class
		}
		if (properties.reference) {
			console.assert(
				!config.returnObject.ids.hasOwnProperty(properties.reference),
				`References must be unique and "${properties.id
					}" is already assigned`
			)
			config.returnObject.references[properties.reference] = element
		}

		config.escapeHTML = properties.escapeHTML && defaults.escapeHTML

		return element
	}


	function buildDom (array) {

		let i = 1
		let callback
		const selfClosingHTMLTags = [
			'area',
			'base',
			'br',
			'col',
			'command',
			'embed',
			'hr',
			'img',
			'input',
			'keygen',
			'link',
			'menuitem',
			'meta',
			'param',
			'source',
			'track',
			'wbr'
		]


		if (typeof array[0] === 'string') {
			array[0] = createElement(array[0])
		}
		else if (Array.isArray(array[0])) {
			i = 0
		}
		else {
			throw new Error(
				'First element of array must be a string, ' +
				'or an array and not ' + JSON.stringify(array[0])
			)
		}


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
				if (config.escapeHTML)
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

				buildDom(array[i])

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
			else {
				throw new TypeError(`"${array[i]}" is not allowed as a value`)
			}
		}


		if (array[0] !== false) {
			let HTMLString = '<' + array[0].tag

			for (const key in array[0].attr) {
				if (array[0].attr.hasOwnProperty(key)) {
					let attributeValue = escape.attribute(array[0].attr[key])
					let value = attributeValue

					if (defaults.quoteAttributes ||
						/[ "'=<>]/.test(attributeValue)
					) {
						value = defaults.quotationMark +
							attributeValue + defaults.quotationMark
					}

					HTMLString += ` ${key}=${value}`
				}
			}

			HTMLString += '>'

			if (!selfClosingHTMLTags.includes(array[0].tag)) {
				array[0].children.forEach(child => HTMLString += child)

				HTMLString += '</' + array[0].tag + '>'
			}

			array[0] = HTMLString
		}

		// Return root element on index 0
		config.returnObject[0] = array[0]
		config.returnObject.rootElement = array[0]

		config.returnObject.toString = () => array[0]

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
