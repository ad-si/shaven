const webpack = require('webpack')
const babelLoader = {
  test: /\.js$/,
  loader: 'babel-loader',
}


module.exports = [
  {
    target: 'web',
    entry: './source/scripts/main.js',
    output: {
      path: __dirname + '/site/scripts',
      filename: 'bundle.js',
    },
    module: {
      rules: [
        babelLoader,
        { test: /\.json$/, use: 'json-loader' },
        { test: /\.png$/, use: 'url-loader' },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        { test: /\.styl$/, use: [
          'style-loader',
          'css-loader',
          'stylus-loader',
        ] },
      ],
    },
    mode: 'production',
  },
  {
    target: 'web',
    entry: './source/library/browser.js',
    output: {
      path: __dirname,
      filename: 'shaven.js',
      library: 'shaven',
    },
    module: {
      rules: [babelLoader],
    },
  },
  {
    target: 'web',
    entry: './source/library/browser.js',
    output: {
      path: __dirname,
      filename: 'shaven.min.js',
      library: 'shaven',
    },
    module: {
      rules: [babelLoader],
    },
    mode: 'production',
  },
  {
    target: 'web',
    entry: './source/library/server.js',
    output: {
      path: __dirname,
      filename: 'shaven-server.min.js',
      library: 'shaven',
    },
    module: {
      rules: [babelLoader],
    },
    mode: 'production',
    resolve: {
      fallback: {
        assert: false,
      },
    },
  },
  {
    entry: './test/bundle/main.js',
    output: {
      path: __dirname + '/test/bundle',
      filename: 'bundle.js',
    },
    module: {
      rules: [babelLoader],
    },
    mode: 'production',
  },
]
