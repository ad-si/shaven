const webpack = require('webpack')
const babelLoader = {
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    presets: ['es2015'],
  },
}

module.exports = [
  {
    entry: './source/scripts/main.js',
    output: {
      path: __dirname + '/site/scripts',
      filename: 'bundle.js',
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel-loader', query: {presets: ['es2015']}},
        { test: /\.json$/, loader: 'json-loader' },
        { test: /\.png$/, loader: 'url-loader' },
        { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
        { test: /\.styl$/, loaders: [
          'style-loader',
          'css-loader',
          'stylus-loader',
        ] },
      ],
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    ],
  },
  {
    entry: './source/library/browser.js',
    output: {
      path: __dirname,
      filename: 'shaven.js',
      library: 'shaven',
    },
    module: {
      loaders: [babelLoader],
    },
  },
  {
    entry: './source/library/browser.js',
    output: {
      path: __dirname,
      filename: 'shaven.min.js',
      library: 'shaven',
    },
    module: {
      loaders: [babelLoader],
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    ],
  },
  {
    entry: './source/library/server.js',
    output: {
      path: __dirname,
      filename: 'shaven-server.min.js',
      library: 'shaven',
    },
    module: {
      loaders: [babelLoader],
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    ],
  },
  {
    entry: './test/bundle/main.js',
    output: {
      path: __dirname + '/test/bundle',
      filename: 'bundle.js',
    },
    module: {
      loaders: [babelLoader],
    },
  },
]
