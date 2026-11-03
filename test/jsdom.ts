import jsdom from 'jsdom'
import shaven from '../source/library/browser.ts'

const {JSDOM} = jsdom
const {window} = new JSDOM()

global.shaven = shaven
global.document = window.document
global.Element = window.Element

import './core.ts'
import './dom.ts'
