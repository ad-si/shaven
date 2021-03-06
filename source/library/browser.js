/* eslint-disable no-console */

import parseSugarString from './parseSugarString.js'
import defaults from './defaults.js'
import namespaceToURL from './namespaceToURL.js'
import mapAttributeValue from './mapAttributeValue.js'


export default function shaven (arrayOrObject) {
  const isArray = Array.isArray(arrayOrObject)
  const objType = typeof arrayOrObject

  if (!isArray && objType !== 'object') {
    throw new Error(
      'Argument must be either an array or an object ' +
      'and not ' + JSON.stringify(arrayOrObject),
    )
  }

  if (isArray && arrayOrObject.length === 0) {
    // Ignore empty arrays
    return {}
  }

  let config = {}
  let elementArray

  if (Array.isArray(arrayOrObject)) {
    elementArray = arrayOrObject
  }
  else {
    elementArray = arrayOrObject.elementArray
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
    },
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
      namespaceToURL[namespace] ? namespaceToURL[namespace] : namespace,
      properties.tag,
    )

    if (properties.id) {
      element.id = properties.id
      console.assert(
        !Object.prototype.hasOwnProperty
          .call(config.returnObject.ids, properties.id),
        `Ids must be unique and "${properties.id}" is already assigned`,
      )
      config.returnObject.ids[properties.id] = element
    }
    if (properties.class) {
      element.classList.add(...properties.class.split(' '))
    }
    if (properties.reference) {
      console.assert(
        !Object.prototype.hasOwnProperty
          .call(config.returnObject.ids, properties.reference),
        `References must be unique and "${properties.id
        }" is already assigned`,
      )
      config.returnObject.references[properties.reference] = element
    }

    config.escapeHTML = properties.escapeHTML != null
      ? properties.escapeHTML
      : config.escapeHTML

    return element
  }


  function buildDom (array) {
    if (Array.isArray(array) && array.length === 0) {
      // Ignore empty arrays
      return {}
    }

    let index = 1
    let createdCallback

    if (typeof array[0] === 'string') {
      array[0] = createElement(array[0])
    }
    else if (Array.isArray(array[0])) {
      index = 0
    }
    else if (!(array[0] instanceof Element)) {
      throw new Error(
        'First element of array must be either a string, ' +
        'an array or a DOM element and not ' + JSON.stringify(array[0]),
      )
    }


    // For each in the element array (except the first)
    for (; index < array.length; index++) {

      // Don't render element if value is false or null
      if (array[index] === false || array[index] === null) {
        array[0] = false
        break
      }

      // Continue with next array value if current is undefined or true
      else if (array[index] === undefined || array[index] === true) {
        continue
      }

      // If is string has to be content so set it
      else if (typeof array[index] === 'string' ||
        typeof array[index] === 'number'
      ) {
        if (config.escapeHTML) {
          while (array[0].firstChild) {
            array[0].removeChild(array[0].firstChild)
          }
          array[0].appendChild(document.createTextNode(array[index]))
        }
        else {
          array[0].innerHTML = array[index]
        }
      }

      // If is array has to be child element
      else if (Array.isArray(array[index])) {
        // If is actually a sub-array, flatten it
        if (Array.isArray(array[index][0])) {
          array[index]
            .reverse()
            .forEach(subArray => { // eslint-disable-line no-loop-func
              array.splice(index + 1, 0, subArray)
            })

          if (index !== 0) continue
          index++
        }

        // Build dom recursively for all child elements
        buildDom(array[index])

        // Append the element to its parent element
        if (array[index][0]) {
          array[0].appendChild(array[index][0])
        }
      }

      else if (typeof array[index] === 'function') {
        createdCallback = array[index]
      }

      // If it is an element append it
      else if (array[index] instanceof Element) {
        array[0].appendChild(array[index])
      }

      // Else must be an object with attributes
      else if (typeof array[index] === 'object') {
        // For each attribute
        for (const attributeKey in array[index]) {
          if (
            Object.prototype.hasOwnProperty
              .call(!array[index], attributeKey)
          ) continue

          const attributeValue = array[index][attributeKey]

          if (
            Object.prototype.hasOwnProperty
              .call(array[index], attributeKey) &&
            attributeValue !== null &&
            attributeValue !== false
          ) {
            array[0].setAttribute(
              attributeKey,
              mapAttributeValue(
                attributeKey,
                attributeValue,
                config,
              ),
            )
          }
        }
      }
      else {
        throw new TypeError(`"${array[index]}" is not allowed as a value`)
      }
    }


    config.nsStack.pop()

    // Return root element on index 0
    config.returnObject[0] = array[0]
    config.returnObject.rootElement = array[0]

    config.returnObject.toString = () => array[0].outerHTML

    if (createdCallback) createdCallback(array[0])
  }


  buildDom(elementArray)

  return config.returnObject
}

shaven.setDefaults = (object) => {
  Object.assign(defaults, object)
  return shaven
}
