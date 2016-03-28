import shaven from '../..'

shaven([document.getElementById('test'),
	['h1', 'Test'],
	['p.sentence', 'Test sentence'],
	['ul#list',
		['li', 12],
		['li', 'foo']
	]
])

shaven(
	[document.getElementById('test'),
		['svg#svg', {width: 100, height: 50},
			['circle', {r: 5, cx: 10, cy: 10, fill: 'red'}],
			['text', {y: 20}, '<circle>']
		]
	]
)
