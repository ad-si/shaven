import assert from 'assert'

import shaven from '../../source/library/browser.js'


shaven([document.getElementById('test'),
  ['h1', 'Test'],
  ['p.sentence', 'Test sentence'],
  ['p.sentence', 'Sentence with escaped <em>HTML</em>'],
  ['p.sentence!', 'Sentence with unescaped <em>HTML</em>'],
  ['ul#list',
    ['li', 12],
    ['li', 'foo'],
  ],
])

const svg = shaven(
  [document.getElementById('test'),
    ['svg#svg', {width: 100, height: 50},
      ['circle.important.small$test', {
        r: 5, // eslint-disable-line id-length
        cx: 10,
        cy: 10,
        fill: 'red',
      }],
      ['text',
        '<circle>',
        {y: 20}, // eslint-disable-line id-length
      ],
    ],
  ],
)

assert.ok(
  svg.references.test instanceof Element,
  'Circle is instanceof Element',
)
assert.ok(
  svg.references.test.classList.contains('important'),
  'Circle classList contains "important"',
)
assert.ok(
  svg.references.test.classList.contains('small'),
  'Circle classList contains "small"',
)

export default {}
