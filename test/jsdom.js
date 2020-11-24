import jsdom from 'jsdom'
import shaven from '../source/library/browser.js'

const {JSDOM} = jsdom

global.shaven = shaven
global.document = new JSDOM().window.document
global.window = document.defaultView
global.navigator = window.navigator
global.Element = window.Element

import './core.js'
import './dom.js'
