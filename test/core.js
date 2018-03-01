/* globals shaven*/
import it from 'ava'

if (global.document) {
  it.beforeEach(() => {
    const container = document.createElement('div')
    container.id = 'test'
    document.body.appendChild(container)
  })

  it.afterEach(() => {
    document.getElementById('test').outerHTML = ''
  })
}


it('sets a string as textContent', (test) => {
  const expected = '<p>test</p>'
  let element = shaven(['p', 'test'])[0]

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, expected)
})


it('sets a number as textContent', (test) => {
  const expected = '<p>1234</p>'
  let element = shaven(['p', 1234])[0]

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, expected)
})


it('builds elements recursively', (test) => {
  const expected = '<div><p>foo<em>bar</em></p></div>'
  let actual = shaven(
    ['div',
      ['p', 'foo',
        ['em', 'bar'],
      ],
    ]
  )[0]

  if (typeof actual !== 'string') {
    actual = actual.outerHTML
  }
  test.is(actual, expected)
})


it('is possible to set properties', (test) => {
  const expectedString = '<p id="foo" class="bar" data-info="baz"></p>'
  const actual = shaven(
    ['p', {
      id: 'foo',
      class: 'bar',  // class is restricted word
      'data-info': 'baz', // attribute with dash
    }]
  ).rootElement

  if (typeof actual === 'string') {
    test.is(actual, expectedString)
  }
  else {
    document.getElementById('test').innerHTML = expectedString
    const expectedElement = document.getElementById('foo')

    test.is(actual.outerHTML, expectedElement.outerHTML)
    test.true(
      actual.isEqualNode(expectedElement),
      '\n' + actual.outerHTML +
      '\nshould equal\n' + expectedElement.outerHTML
    )
  }
})


it('does not set falsy properties', (test) => {
  const expectedString = '<p title="foo" tabindex="3" data-info=""></p>'
  const actual = shaven(
    ['p', {
      title: 'foo',
      tabindex: 3,
      lang: false,
      'data-test': null,
      'data-info': undefined,
    }]
  )[0]


  if (typeof actual === 'string') {
    test.is(actual, expectedString)
  }
  else {
    document.getElementById('test').innerHTML = expectedString

    const expectedElement = document.getElementsByTagName('p')[0]

    test.true(
      actual.isEqualNode(expectedElement),
      '\n' + actual.outerHTML + '\nshould equal\n' +
        expectedElement.outerHTML
    )
  }
})


it('builds a string from a style object', (test) => {
  const expected = '<p ' +
    'style="color:rgb(255,0,0);font-size:10;' +
      'font-family:Arial, \'Helvetica Neue\', ' +
      'sans-serif"></p>'
  let actual = shaven(
    ['p', {
      style: {
        color: 'rgb(255,0,0)',
        'font-size': 10,
        'font-family': 'Arial, "Helvetica Neue", sans-serif',
      },
    }]
  )[0]

  if (typeof actual !== 'string') {
    actual = actual.outerHTML
  }

  test.is(actual, expected)
})


it('does not include falsy values in style string', (test) => {
  const expected = '<p style="color:red"></p>'
  let actual = shaven(
    ['p', {
      style: {
        color: 'red',
        border: false,
        'background-color': null,
        visibility: undefined,
      },
    }]
  )[0]

  if (typeof actual !== 'string') {
    actual = actual.outerHTML
  }

  test.is(actual, expected)
})


it('builds a transform string from a list of transform objects', (test) => {
  const expected = '<svg width="50" height="50">' +
    '<circle r="5" transform="translate(4,5) skewX(6)"></circle>' +
    '</svg>'
  let actual = shaven(
    ['svg', {width: 50, height: 50},
      ['circle', {
        r: 5, // eslint-disable-line id-length
        transform: [
          {
            type: 'translate',
            x: 4, // eslint-disable-line id-length
            y: 5, // eslint-disable-line id-length
          },
          {
            type: 'skewX',
            x: 6, // eslint-disable-line id-length
          },
        ],
      }],
    ]
  ).rootElement

  if (typeof actual !== 'string') {
    actual = actual.outerHTML
  }

  test.is(actual, expected)
})


it('does ignore "true" values', (test) => {
  const expected = '<p>test</p>'
  let actual = shaven(['p', 'test', true])[0]

  if (typeof actual !== 'string') {
    actual = actual.outerHTML
  }

  test.is(actual, expected)
})



it('uses div as default tag', (test) => {
  const expected = '<div id="foo"></div>'
  let actual = shaven(['#foo'])[0]

  if (typeof actual !== 'string') {
    actual = actual.outerHTML
  }

  test.is(actual, expected)
})


it('sets the id', (test) => {
  const expected = '<p id="foo-1"></p>'
  let actual = shaven(['p#foo-1'])[0]

  if (typeof actual !== 'string') {
    actual = actual.outerHTML
  }

  test.is(actual, expected)
})


it('sets the class', (test) => {
  const expected = '<p class="foo"></p>'
  let actual = shaven(['p.foo'])[0]

  if (typeof actual !== 'string') {
    actual = actual.outerHTML
  }

  test.is(actual, expected)
})


it('works with both class and id', (test) => {
  const expectedString = '<p id="b" class="new"></p>'
  const element = shaven(['p#b.new'])[0]

  if (typeof element === 'string') {
    test.is(element, expectedString)
  }
  else {
    document.getElementById('test').innerHTML = expectedString

    const expectedElement = document.getElementById('b')

    test.true(
      element.isEqualNode(expectedElement),
      element.outerHTML +
      '\nshould be equal to\n' +
      expectedElement.outerHTML
    )
  }
})


it('works with class and id reversed', (test) => {
  const expectedString = '<p id="c" class="new"></p>'
  const element = shaven(['p.new#c'])[0]

  if (typeof element === 'string') {
    test.is(element, expectedString)
  }
  else {
    document
      .getElementById('test')
      .innerHTML = expectedString

    const expectedElement = document
      .getElementById('c')

    test.true(
      element.isEqualNode(expectedElement),
      element.outerHTML +
      '\nshould to be equal to\n' +
      expectedElement.outerHTML
    )
  }
})


it('understands multiple classes and ids', (test) => {
  const expectedString = '<p id="foo" class="bar baz"></p>'
  const element = shaven(['p.bar#foo.baz'])[0]

  if (typeof element === 'string') {
    test.is(element, expectedString)
  }
  else {
    document.getElementById('test').innerHTML = expectedString
    const expectedElement = document.getElementById('foo')

    test.true(
      element.isEqualNode(expectedElement),
      element.outerHTML +
      '\nshould to be equal to\n' +
      expectedElement.outerHTML
    )
  }
})


it('calls the provided callback function', (test) => {
  let called = false
  let element = false

  function foo (el) {
    called = true
    element = el
  }

  const shavenObject = shaven(['p#bar', foo])

  test.true(called)
  test.is(element, shavenObject[0])
})


it('returns a shaven object and not an html element/string', (test) => {
  const shavenObject = shaven(['p'])

  test.is(typeof shavenObject, 'object')
  test.not(shavenObject.nodeType, 1)
})

it('links ids and references', (test) => {
  const shavenObject = shaven(['ul',
    ['li#first', 'First'],
    ['li$second', 'Second'],
  ])
  const element = shavenObject.rootElement

  if (typeof element === 'string') {
    test.is(shavenObject.ids.first.tag, 'li')
    test.is(shavenObject.references.second.tag, 'li')
  }
  else {
    test.is(shavenObject.ids.first.outerHTML, '<li id="first">First</li>')
    test.is(shavenObject.references.second.outerHTML, '<li>Second</li>')
  }
})

it('returns the root html element by referencing [0]', (test) => {
  const shavenObject = shaven(['p'])
  const element = shavenObject[0]

  if (typeof element === 'string') {
    test.is('<p></p>', element)
  }
  else {
    test.is(element.nodeType, 1)
  }
})


it('returns the root HTML element by referencing rootElement', (test) => {
  const shavenObject = shaven(['p'])
  const element = shavenObject.rootElement

  if (typeof element === 'string') {
    test.is('<p></p>', element)
  }
  else {
    test.is(element.nodeType, 1)
  }
})


it('returns the HTML of the root element when converted to string', (test) => {
  const shavenObject = shaven(['p#test', 'Test'])

  test.is('<p id="test">Test</p>', String(shavenObject))
})


it('escapes html strings in tags', (test) => {
  const html = '<p>Some <strong>HTML</strong></p>'
  const escapedHtml = '&lt;p&gt;Some ' +
    '&lt;strong&gt;HTML&lt;/strong&gt;' +
    '&lt;/p&gt;'
  let element = shaven(['div', html])[0]

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, `<div>${escapedHtml}</div>`)
})


it('sets attribute to 0', (test) => {
  const html = '<p title="0">Test</p>'
  let element = shaven(['p', 'Test', {title: 0}])[0]

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, html)
})


it('escapes html strings in attributes', (test) => {
  const escapedHtml =
    '<p ' +
    'title="&quot; &amp;" ' +
    'lang="\' < >"' +
    '>' +
    'Test' +
    '</p>'
  let element = shaven(
    ['p', 'Test', {
      title: '" &',
      lang: '\' < >',
    }]
  )[0]

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, escapedHtml)
})


it('supports unquoted element attributes on server', (test) => {
  shaven.setDefaults({quoteAttributes: false})
  const element = shaven(
    ['p', {
      lang: 'de',
      'data-info': 'baz',
      title: 'With space',
      'data-special': 'Special characters: "\'=><`',
    }]
  ).rootElement

  if (typeof element !== 'string') {
    test.pass()
  }
  else {
    test.is(
      element,
      '<p lang=de data-info=baz title="With space" ' +
      'data-special="Special characters: &quot;\'=><`"></p>'
    )
  }

  shaven.setDefaults({quoteAttributes: true})
})


it('supports unescaped element content', (test) => {
  const html = '<p>Some <strong>HTML</strong></p>'
  let element = shaven(['div!', html])[0]
  let elementAmpersand = shaven(['div&', html])[0]

  if (typeof element !== 'string') {
    element = element.outerHTML
    elementAmpersand = elementAmpersand.outerHTML
  }

  test.is(element, `<div>${html}</div>`)
  test.is(elementAmpersand, element)
})


it('accepts an array of elements', (test) => {
  const html = '<p>Numbers: ' +
    '<span>1</span>' +
    '<span>2</span>' +
    '<span>3</span>' +
    '<span>4</span>' +
    '</p>'
  let element = shaven(
    ['p', 'Numbers: ', [
      ['span', '1'],
      ['span', '2'],
      [
        ['span', '3'],
        ['span', '4'],
      ],
    ]]
  )[0]

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, html)
})


it('ignores "undefined" in subarrays', (test) => {
  const html = '<p>Numbers: ' +
    '<span>1</span>' +
    '<span>2</span>' +
    '</p>'
  let element = shaven(
    ['p',
      'Numbers: ',
      [
        ['span', '1'],
        undefined,
        ['span', '2'],
      ],
    ]
  ).rootElement

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, html)
})


it('accepts an array of elements at index 0', (test) => {
  const html = '<p>Numbers: ' +
    '<span>1</span>' +
    '<span>2</span>' +
    '<span>3</span>' +
    '</p>'
  let element = shaven(['p', 'Numbers: ', [
    [
      ['span', '1'],
      ['span', '2'],
      ['span', '3'],
    ],
  ]])[0]

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, html)
})


it('ignores an empty array', (test) => {
  test.plan(1)

  const emptyElem = shaven([])
  test.deepEqual(emptyElem, {})
})


it('ignores an empty subarray', (test) => {
  test.plan(1)
  let element = shaven(['p', 'Test', []]).rootElement

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, '<p>Test</p>')
})


it('throws an error for an invalid array', (test) => {
  test.plan(2)
  const regexString = '.*first ' +
    'element.*must be.*string.*array.*'

  test.throws(
    () => {
      shaven([{key: 'value'}])
    },
    new RegExp(regexString, 'gi')
  )

  test.throws(
    () => {
      shaven([144, 'span', 'text'])
    },
    new RegExp(regexString, 'gi')
  )
})


it('works with SVGs', (test) => {
  const expectedString =
    '<svg id="svg" height="10" width="10">' +
      '<circle class="top" cx="5" cy="5" r="5" style="fill:green">' +
      '</circle>' +
    '</svg>'
  const array = ['svg#svg',
    {
      height: 10,
      width: 10,
    },
    ['circle.top', {
      cx: 5,
      cy: 5,
      r: 5, // eslint-disable-line id-length
      style: 'fill:green',
    }],
  ]
  const svgElement = shaven(array).rootElement

  if (typeof svgElement === 'string') {
    test.is(svgElement, expectedString)
  }
  else {
    document.getElementById('test').innerHTML = expectedString

    const expectedElement = document.getElementById('svg')

    test.true(
      svgElement.isEqualNode(expectedElement),
      '\n' + svgElement.outerHTML +
      '\nshould equal\n' +
      expectedElement.outerHTML
    )
  }
})

it('works with multiple SVGs', (test) => {
  const expectedString = '<div id="container">' +
    '<svg id="svg1" width="10" height="10">' +
      '<rect class="top" width="5" height="5" style="fill:red"></rect>' +
    '</svg>' +
    '<svg id="svg2" width="20" height="20">' +
      '<circle cx="8" cy="8" r="4" style="fill:green"></circle>' +
    '</svg>' +
  '</div>'

  const array = ['div#container',
    ['svg#svg1', {width: 10, height: 10},
      ['rect.top', {width: 5, height: 5, style: 'fill:red'}],
    ],
    ['svg#svg2', {width: 20, height: 20},
      ['circle', {
        cx: 8,
        cy: 8,
        r: 4, // eslint-disable-line id-length
        style: 'fill:green',
      }],
    ],
  ]
  const element = shaven(array).rootElement

  if (typeof element === 'string') {
    test.is(element, expectedString)
  }
  else {
    document.getElementById('test').innerHTML = expectedString
    const expectedElement = document.getElementById('container')

    test.is(element.outerHTML, expectedElement.outerHTML)
    test.true(element.isEqualNode(expectedElement))
  }
})

it('works with SVG followed by HTML', (test) => {
  const expectedString = '<div id="container">' +
    '<svg id="svg1" width="10" height="10">' +
      '<rect class="top" width="5" height="5" style="fill:red"></rect>' +
    '</svg>' +
    '<p>Test Sentence</p>' +
  '</div>'

  const array = ['div#container',
    ['svg#svg1', {width: 10, height: 10},
      ['rect.top', {width: 5, height: 5, style: 'fill:red'}],
    ],
    ['p', 'Test Sentence'],
  ]
  const element = shaven(array).rootElement

  if (typeof element === 'string') {
    test.is(element, expectedString)
  }
  else {
    document.getElementById('test').innerHTML = expectedString
    const expectedElement = document.getElementById('container')

    test.is(element.outerHTML, expectedElement.outerHTML)
    test.true(element.isEqualNode(expectedElement))
  }
})


it('escapes text in SVGs', (test) => {
  const array = ['svg#svg',
    ['text', '<circle>'],
  ]
  const expectedString = '<svg id="svg"><text>&lt;circle&gt;</text></svg>'
  const svgElement = shaven(array).rootElement

  if (typeof svgElement === 'string') {
    test.is(svgElement, expectedString)
  }
  else {
    document.getElementById('test').innerHTML = expectedString
    const expectedElement = document.getElementById('svg')

    test.is(svgElement.outerHTML, expectedElement.outerHTML)
    test.true(svgElement.isEqualNode(expectedElement))
  }
})

// Should fail when implemented with element.className = '…',
// but doesn't. (See https://github.com/tmpvar/jsdom/issues/1528)
it('sets class of SVG element', (test) => {
  const elementArray = ['svg#svg',
    ['circle.test',
      {cx: 5, cy: 5, r: 2}, // eslint-disable-line id-length
    ],
  ]
  const expectedString = `<svg id="svg">
    <circle class="test" cx="5" cy="5" r="2"></circle>
    </svg>`.replace(/\n\s+/g, '')
  const svgElement = shaven(elementArray).rootElement

  if (typeof svgElement === 'string') {
    test.is(svgElement, expectedString)
  }
  else {
    document.getElementById('test').innerHTML = expectedString
    const expectedElement = document.getElementById('svg')

    test.is(svgElement.outerHTML, expectedElement.outerHTML)
    test.true(svgElement.isEqualNode(expectedElement))
  }
})


it('returns an empty element for missing content value', (test) => {
  let element = shaven(['div'])[0]

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, '<div></div>')
})


it('returns an empty element for undefined content value', (test) => {
  let element = shaven(['div', undefined])[0]

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, '<div></div>')
})


it('returns no element if content value is "false"', (test) => {
  let element = shaven(['div', ['p', false]])[0]

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, '<div></div>')
})


it('returns no element if content value is "null"', (test) => {
  let element = shaven(['div', ['p', null]])[0]

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, '<div></div>')
})


it('omit end-tag for self-closing elements', (test) => {
  let element = shaven(['div', ['input', {type: 'text'}]]).rootElement

  if (typeof element !== 'string') {
    element = element.outerHTML
  }

  test.is(element, '<div><input type="text"></div>')
})


it('can be configured to use different quotation mark on server', (test) => {
  const elementWithCustomMark = shaven({
    quotationMark: '%',
    elementArray: [
      'div',
      ['p#wtf', 'Test'],
    ],
  }).rootElement

  if (typeof elementWithCustomMark === 'string') {
    test.is(elementWithCustomMark, '<div><p id=%wtf%>Test</p></div>')
  }
  else {
    test.pass()
  }
})


it('can be configured to not escape HTML', (test) => {
  let unescapedElement = shaven({
    escapeHTML: false,
    elementArray: ['div', '<p>Test</p>'],
  }).rootElement

  if (typeof unescapedElement !== 'string') {
    unescapedElement = unescapedElement.outerHTML
  }

  test.is(unescapedElement, '<div><p>Test</p></div>')
})


it('can change defaults', (test) => {
  let escaped = shaven(['div', '<p>Test</p>']).rootElement

  shaven.setDefaults({escapeHTML: false})

  let unescaped = shaven(['div', '<p>Test</p>']).rootElement

  if (typeof escaped !== 'string') escaped = escaped.outerHTML
  if (typeof unescaped !== 'string') unescaped = unescaped.outerHTML

  test.is(escaped, '<div>&lt;p&gt;Test&lt;/p&gt;</div>')
  test.is(unescaped, '<div><p>Test</p></div>')
})


it('does not mutate the array', (test) => {
  const array = ['div.important', ['p', {lang: 'en'}, 'text']]
  let element1 = shaven(array).rootElement
  let element2 = shaven(array).rootElement
  const expected = '<div class="important"><p lang="en">text</p></div>'

  if (typeof element1 !== 'string') {
    element1 = element1.outerHTML
  }
  if (typeof element2 !== 'string') {
    element2 = element2.outerHTML
  }

  test.is(element1, expected)
  test.is(element2, expected)
})
