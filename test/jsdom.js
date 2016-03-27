import jsdom from 'jsdom'
import shaven from '../source/library/browser.js'

global.shaven = shaven
global.document = jsdom.jsdom()
global.window = document.defaultView
global.navigator = window.navigator
global.Element = window.Element

import './core'
import './dom'
