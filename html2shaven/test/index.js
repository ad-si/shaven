const fs = require('fs')
const path = require('path')
const expect = require('unexpected')
const html2shaven = require('../source/index.js')

process.stdout.write('Converts HTML to shaven array')

const html = fs.readFileSync(path.join(__dirname, './document.html'), 'utf8')
const expected = fs.readFileSync(
  path.join(__dirname, './document.json5'),
  'utf8',
)
const actual = JSON.stringify(html2shaven(html), null, '\t') + '\n'

expect(actual, 'to equal', expected)
console.info(' ✔︎')
