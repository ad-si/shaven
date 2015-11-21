'use strict'

const fs = require('fs')
const path = require('path')
const expect = require('unexpected')
const html2shaven = require('../source/index.js')

{
	process.stdout.write('Converts HTML to shaven array')

	let html = fs.readFileSync(
		path.join(__dirname, './document.html'),
		'utf8'
	)
	let expected = fs.readFileSync(
		path.join(__dirname, './document.json5'),
		'utf8'
	)
	let actual = JSON.stringify(html2shaven(html), null, '\t') + '\n'

	expect(actual, 'to equal', expected)
	console.log(' ✔︎')
}
