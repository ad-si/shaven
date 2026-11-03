import shaven from '../source/library/server.ts'

global.shaven = shaven as unknown as TestShaven

import './core.ts'
import './large.ts'
import './server.ts'
