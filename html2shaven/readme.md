# Html2Shaven

Convert HTML documents to shaven arrays


## Installation

```shell
npm install --save html2shaven
```


## Usage

As a Javascript module:

```js
const fs = require('fs')
const html2shaven = require('./index.js')

let htmlString = fs.readFileSync('document.html', 'utf8')
let shavenArray = html2shaven(htmlString)
```


On the command line:

```
html2shaven < document.html > document.json5
```
