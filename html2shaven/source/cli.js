#! /usr/bin/env node

'use strict'

const stream = require('stream')
const path = require('path')
const html2shaven = require('./index.js')

const usage = `Usage: ${path.basename(process.argv[1])} < file.html > file.json`
let internalBuffer = ''

if (process.stdin.isTTY) {
  console.error(usage)
  process.exit(1)
}
else {
  process.stdin
    .pipe(new stream.Transform({
      write (chunk, encoding, done) {
        internalBuffer += chunk.toString()
        done()
      },
      flush (done) {
        this.push(JSON.stringify(
          html2shaven(internalBuffer), null, 4,
        ) + '\n')
        done()
      },
    }))
    .pipe(process.stdout)
}
