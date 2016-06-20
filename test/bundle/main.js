import assert from 'assert'
import shaven from '../..'

shaven([document.getElementById('test'),
  ['h1', 'Test'],
  ['p.sentence', 'Test sentence'],
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
  ]
)

assert(
  svg.references.test instanceof Element,
  'Circle is instanceof Element'
)
assert(
  svg.references.test.classList.contains('important'),
  'Circle classList contains "important"'
)
assert(
  svg.references.test.classList.contains('small'),
  'Circle classList contains "small"'
)
