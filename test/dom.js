/* globals shaven */

import it from 'ava'
import { createId } from './utils.js'


function createContainer (id) {
  const container = document.createElement('div')
  container.id = id
  document.body.appendChild(container)
  return container
}


it('attaches to elements', (test) => {
  const id = createId()
  const container = createContainer(id)
  const expected = `<div id="${id}"><p></p></div>`
  const actual = shaven([container, ['p']])[0].outerHTML

  test.is(actual, expected, actual)
})


it('appends html elements', (test) => {
  const id = createId()
  const container = createContainer(id)
  const expected = `<div id="${id}"><p></p></div>`
  const element = shaven(['p'])[0]
  const actual = shaven([container, element])[0].outerHTML

  test.is(actual, expected, actual)
})


it('supports hyphens in html tags', (test) => {
  const id = createId()
  const container = createContainer(id)
  const expected = `<div id="${id}">` +
    '<foo-bar></foo-bar>' +
    '</div>'
  const element = shaven(['foo-bar'])[0]
  const actual = shaven([container, element])[0].outerHTML

  test.is(actual, expected, actual)
})


it('escapes HTML strings in tags in JSDOM', (test) => {
  const id = createId()
  const container = createContainer(id)
  const html = '<p>Some <strong>HTML</strong></p>'
  const escapedHtml = '&lt;p&gt;Some ' +
    '&lt;strong&gt;HTML&lt;/strong&gt;' +
    '&lt;/p&gt;'
  const actual = shaven([container, html])[0].outerHTML
  const expected = `<div id="${id}">${escapedHtml}</div>`

  test.is(actual, expected)
})


it('returns a shaven object with links to elements with ids', (test) => {
  const id = createId()
  const container = createContainer(id)
  const shavenObject = shaven(
    [container,
      ['p#foo'],
      ['p#bar'],
    ],
  )

  test.deepEqual(shavenObject.ids.foo, document.getElementById('foo'))
  test.deepEqual(shavenObject.ids.bar, document.getElementById('bar'))
})


it('returns marked elements ', (test) => {
  const id = createId()
  const container = createContainer(id)
  const shavenObject = shaven(
    [container,
      ['a$foo'],
      ['p$bar'],
    ],
  )

  test.deepEqual(
    shavenObject.references.foo,
    document.getElementsByTagName('a')[0],
  )
  test.deepEqual(
    shavenObject.references.bar,
    document.getElementsByTagName('p')[0],
  )
})


it('uses specified namespace', (test) => {
  const circle = shaven({
    namespace: 'svg',
    elementArray: ['circle', {r: 5}], // eslint-disable-line id-length
  })
  let svgElement = shaven(['svg',
    ['rect', {width: 5, height: 5}],
    circle.rootElement,
  ]).rootElement

  if (typeof svgElement !== 'string') {
    svgElement = svgElement.outerHTML
  }

  test.is(
    svgElement,
    '<svg>' +
      '<rect width="5" height="5"></rect>' +
      '<circle r="5"></circle>' +
    '</svg>',
  )
})
