import jsdom from 'jsdom'

global.document = jsdom.jsdom()
global.window = document.defaultView
global.navigator = window.navigator
global.Element = window.Element

import './dom'
import './core'
