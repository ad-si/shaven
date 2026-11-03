import parseSugarString from './parseSugarString.ts'
import * as escape from './escape.ts'
import defaults from './defaults.ts'
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

export interface VirtualElement {
  tag: string
  attr: Record<string, unknown>
  children: (string | number)[]
}

export type ServerShavenArray = ShavenArray<never, string>
export type ServerShavenInput = ShavenInput<never, string>
export type ServerShavenObject = ShavenObject<VirtualElement, string>


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
  'wbr',
]


function shaven (arrayOrObject: []): EmptyObject
function shaven (arrayOrObject: ServerShavenInput): ServerShavenObject
function shaven (
  arrayOrObject: ServerShavenInput | [],
): ServerShavenObject | EmptyObject {
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

  let userConfig: Partial<Config> & {elementArray?: unknown} = {}
  let elementArray: unknown[] = []

  if (Array.isArray(arrayOrObject)) {
    elementArray = arrayOrObject.slice(0)
  }
  else {
    elementArray = arrayOrObject.elementArray.slice(0)
    userConfig = Object.assign(userConfig, arrayOrObject)
    delete userConfig.elementArray
  }

  const config: Config = Object.assign({}, defaults, userConfig)

  const returnObject = { // Shaven object to return at last
    ids: {},
    references: {},
  } as ServerShavenObject


  function createElement (sugarString: string): VirtualElement {
    const properties = parseSugarString(sugarString)
    const element: VirtualElement = {
      tag: properties.tag,
      attr: {},
      children: [],
    }

    if (properties.id) {
      element.attr.id = properties.id
      if (
        Object.prototype.hasOwnProperty
          .call(returnObject.ids, properties.id)
      ) {
        throw new Error(
          `Ids must be unique and "${
            properties.id}" is already assigned`,
        )
      }

      returnObject.ids[properties.id] = element
    }
    if (properties.class) {
      element.attr.class = properties.class
    }
    if (properties.reference) {
      if (
        Object.prototype.hasOwnProperty
          .call(returnObject.references, properties.reference)
      ) {
        throw new Error(
          `References must be unique and "${
            properties.reference}" is already assigned`,
        )
      }

      returnObject.references[properties.reference] = element
    }

    config.escapeHTML = properties.escapeHTML != null
      ? properties.escapeHTML
      : config.escapeHTML

    return element
  }


  function buildDom (elemArray: unknown[]): ServerShavenObject | EmptyObject {
    if (Array.isArray(elemArray) && elemArray.length === 0) {
      // Ignore empty arrays
      return {}
    }

    let index = 1
    let createdCallback: ((element: string) => void) | undefined
    // Clone to avoid mutation problems
    // Index 0 holds the sugar string, then the created element,
    // then the rendered HTML string, or `false` if it must not be rendered.
    const array = elemArray.slice(0)


    if (typeof array[0] === 'string') {
      array[0] = createElement(array[0])
    }
    else if (Array.isArray(array[0])) {
      index = 0
    }
    else {
      throw new Error(
        'First element of array must be a string, ' +
        'or an array and not ' + JSON.stringify(array[0]),
      )
    }


    for (; index < array.length; index++) {
      const value = array[index]
      const element = array[0] as VirtualElement

      // Don't render element if value is false or null
      if (value === false || value === null) {
        array[0] = false
        break
      }

      // Continue with next array value if current value is undefined or true
      else if (value === undefined || value === true) {
        continue
      }

      else if (typeof value === 'string') {
        const content = config.escapeHTML
          // oxlint-disable-next-line new-cap
          ? escape.HTML(value)
          : value

        array[index] = content
        element.children.push(content)
      }

      else if (typeof value === 'number') {
        element.children.push(value)
      }

      else if (Array.isArray(value)) {

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

        const childObject = buildDom(array[index] as unknown[])
        array[index] = childObject

        if (0 in childObject && childObject[0]) {
          (array[0] as VirtualElement).children.push(childObject[0])
        }
      }

      else if (typeof value === 'function') {
        createdCallback = value as (element: string) => void
      }

      else if (typeof value === 'object') {
        const attributes = value as Record<string, AttributeValue>

        for (const attributeKey in attributes) {
          if (
            !Object.prototype.hasOwnProperty.call(attributes, attributeKey)
          ) continue

          const attributeValue = attributes[attributeKey]

          if (attributeValue !== null && attributeValue !== false) {
            element.attr[attributeKey] =
              mapAttributeValue(attributeKey, attributeValue)
          }
        }
      }
      else {
        throw new TypeError(`"${String(value)}" is not allowed as a value`)
      }
    }


    if (array[0] !== false) {
      const element = array[0] as VirtualElement
      let HTMLString = '<' + element.tag

      for (const key in element.attr) {
        if (Object.prototype.hasOwnProperty.call(element.attr, key)) {
          const attributeValue = escape.attribute(element.attr[key])
          let value = attributeValue

          if (config.quoteAttributes ||
            /[ "'=<>]/.test(attributeValue)
          ) {
            value = config.quotationMark +
              attributeValue + config.quotationMark
          }

          HTMLString += ` ${key}=${value}`
        }
      }

      HTMLString += '>'

      if (!selfClosingHTMLTags.includes(element.tag)) {
        element.children.forEach(child => HTMLString += child)

        HTMLString += '</' + element.tag + '>'
      }

      array[0] = HTMLString
    }

    const rootElement = array[0] as string | false

    // Return root element on index 0
    returnObject[0] = rootElement
    returnObject.rootElement = rootElement

    returnObject.toString = () => rootElement || ''

    // Elements which are not rendered are not passed to the callback
    if (createdCallback && rootElement !== false) {
      createdCallback(rootElement)
    }

    return returnObject
  }

  return buildDom(elementArray)
}

shaven.setDefaults = (object: Partial<Config>): typeof shaven => {
  Object.assign(defaults, object)
  return shaven
}

export default shaven
