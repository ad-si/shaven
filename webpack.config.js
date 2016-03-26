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
		entry: './source/library/browser.js',
		output: {
			path: __dirname + '/build',
			filename: 'shaven.js',
		}
	},
	// TODO: Re-enable when ava is webpack compatible
	// {
	// 	entry: './test/main.js',
	// 	output: {
	// 		path: __dirname + '/test',
	// 		filename: 'bundle.js'
	// 	},
	// 	module: {
	// 		loaders: [
	// 			{
	// 				test: /\.js$/,
	// 				loader: 'babel',
	// 				query: {
	// 					presets: ['es2015']
	// 				},
	// 			}
	// 		]
	// 	}
	// }
]
