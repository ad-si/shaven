import shaven from '../..'

shaven([document.getElementById('test'),
	['h1', 'Test'],
	['p.sentence', 'Test sentence'],
	['ul#list',
		['li', 12],
		['li', 'foo']
	]
])
