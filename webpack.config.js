const webpack = require('webpack')
const babelLoader = {
  test: /\.js$/,
  loader: 'babel',
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
        { test: /\.js$/, loader: 'babel', query: {presets: ['es2015']}},
        { test: /\.json$/, loader: 'json' },
        { test: /\.png$/, loader: 'url' },
        { test: /\.css$/, loaders: ['style', 'css'] },
        { test: /\.styl$/, loaders: ['style', 'css', 'stylus'] },
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
