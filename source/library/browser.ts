/* oxlint-disable no-console */

import parseSugarString from './parseSugarString.ts'
import defaults from './defaults.ts'
import namespaceToURL from './namespaceToURL.ts'
import mapAttributeValue from './mapAttributeValue.ts'
import type {
  AttributeValue,
  Config,
  EmptyObject,
  ShavenArray,
  ShavenInput,
  ShavenObject,
} from './types.ts'

export type * from './types.ts'

export type BrowserShavenArray = ShavenArray<Element, Element>
export type BrowserShavenInput = ShavenInput<Element, Element>
export type BrowserShavenObject = ShavenObject<Element, Element>

interface BrowserConfig extends Config {
  nsStack: string[]
}


function shaven (arrayOrObject: []): EmptyObject
function shaven (arrayOrObject: BrowserShavenInput): BrowserShavenObject
function shaven (
  arrayOrObject: BrowserShavenInput | [],
): BrowserShavenObject | EmptyObject {
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

  const userConfig: Partial<Config> = {}
  let elementArray: unknown[]

  if (Array.isArray(arrayOrObject)) {
    elementArray = arrayOrObject
  }
  else {
    elementArray = arrayOrObject.elementArray
    delete (arrayOrObject as Partial<typeof arrayOrObject>).elementArray
    Object.assign(userConfig, arrayOrObject)
  }

  const returnObject = { // Shaven object to return at last
    ids: {},
    references: {},
  } as BrowserShavenObject

  const config: BrowserConfig = Object.assign(
    {},
    defaults,
    userConfig,
    {nsStack: [] as string[]},
  )

  config.nsStack = [config.namespace] // Stack with current namespaces


  function createElement (sugarString: string): Element {
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
          .call(returnObject.ids, properties.id),
        `Ids must be unique and "${properties.id}" is already assigned`,
      )
      returnObject.ids[properties.id] = element
    }
    if (properties.class) {
      element.classList.add(...properties.class.split(' '))
    }
    if (properties.reference) {
      console.assert(
        !Object.prototype.hasOwnProperty
          .call(returnObject.references, properties.reference),
        `References must be unique and "${properties.reference
        }" is already assigned`,
      )
      returnObject.references[properties.reference] = element
    }

    config.escapeHTML = properties.escapeHTML != null
      ? properties.escapeHTML
      : config.escapeHTML

    return element
  }


  // The array is modified in place:
  // Index 0 holds the sugar string, then the created element,
  // or `false` if the element must not be rendered.
  function buildDom (array: unknown[]): void {
    if (Array.isArray(array) && array.length === 0) {
      // Ignore empty arrays
      return
    }

    let index = 1
    let createdCallback: ((element: Element) => void) | undefined

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
      const value = array[index]
      const parent = array[0] as Element

      // Don't render element if value is false or null
      if (value === false || value === null) {
        array[0] = false
        break
      }

      // Continue with next array value if current is undefined or true
      else if (value === undefined || value === true) {
        continue
      }

      // If is string has to be content so set it
      else if (typeof value === 'string' || typeof value === 'number') {
        if (config.escapeHTML) {
          while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
          }
          parent.appendChild(document.createTextNode(String(value)))
        }
        else {
          parent.innerHTML = String(value)
        }
      }

      // If is array has to be child element
      else if (Array.isArray(value)) {
        // If is actually a sub-array, flatten it
        if (Array.isArray(value[0])) {
          // Reversing in place is part of the existing (observable) behavior
          value
            // oxlint-disable-next-line unicorn/no-array-reverse
            .reverse()
            // oxlint-disable-next-line no-loop-func -- Called synchronously
            .forEach((subArray: unknown) => {
              array.splice(index + 1, 0, subArray)
            })

          if (index !== 0) continue
          index++
        }

        const childArray = array[index] as unknown[]

        // Build dom recursively for all child elements
        buildDom(childArray)

        // Append the element to its parent element
        if (childArray[0]) {
          (array[0] as Element).appendChild(childArray[0] as Element)
        }
      }

      else if (typeof value === 'function') {
        createdCallback = value as (element: Element) => void
      }

      // If it is an element append it
      else if (value instanceof Element) {
        parent.appendChild(value)
      }

      // Else must be an object with attributes
      else if (typeof value === 'object') {
        const attributes = value as Record<string, AttributeValue>

        // For each attribute
        for (const attributeKey in attributes) {
          if (
            !Object.prototype.hasOwnProperty.call(attributes, attributeKey)
          ) continue

          const attributeValue = attributes[attributeKey]

          if (attributeValue !== null && attributeValue !== false) {
            parent.setAttribute(
              attributeKey,
              String(mapAttributeValue(attributeKey, attributeValue)),
            )
          }
        }
      }
      else {
        throw new TypeError(`"${String(value)}" is not allowed as a value`)
      }
    }


    config.nsStack.pop()

    const rootElement = array[0] as Element | false

    // Return root element on index 0
    returnObject[0] = rootElement
    returnObject.rootElement = rootElement

    returnObject.toString = () => rootElement ? rootElement.outerHTML : ''

    // Elements which are not rendered are not passed to the callback
    if (createdCallback && rootElement) createdCallback(rootElement)
  }


  buildDom(elementArray)

  return returnObject
}

shaven.setDefaults = (object: Partial<Config>): typeof shaven => {
  Object.assign(defaults, object)
  return shaven
}

export default shaven
