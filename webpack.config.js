module.exports = [
	{
		entry: './source/scripts/main.js',
		output: {
			path: __dirname + '/build/scripts',
			filename: 'bundle.js',
		},
		module: {
			loaders: [
				{ test: /\.json$/, loader: 'json' },
				{ test: /\.css$/, loaders: ['style', 'css'] },
				{ test: /\.styl$/, loaders: ['style', 'css', 'stylus'] },
			]
		}
	},
	{
		entry: './source/scripts/browser.js',
		output: {
			path: __dirname + '/build',
			filename: 'shaven.js',
		}
	},
	// {
	// 	entry: './test/index.js',
	// 	output: {
	// 		path: './test',
	// 		filename: 'bundle.js'
	// 	},
	// 	module: {
	// 		loaders: [
	// 			{ test: /\.js$/, loader: 'mocha' },
	// 		]
	// 	}
	// }
]
