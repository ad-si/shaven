const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const babelLoader = {
  test: /\.js$/,
  loader: 'babel-loader',
}

module.exports = [
  {
    target: 'web',
    entry: './source/scripts/main.js',
    output: {
      path: path.join(__dirname, '/site/scripts'),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        babelLoader,
        { test: /\.json$/, use: 'json-loader' },
        { test: /\.png$/, type: 'asset/inline' },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
        { test: /\.styl$/, use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'stylus-loader',
        ] },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({filename: 'bundle.css'}),
    ],
    mode: 'production',
  },
  {
    target: 'web',
    entry: './source/library/browser.js',
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'browser.js',
      library: 'shaven',
    },
    module: {
      rules: [babelLoader],
    },
    mode: 'production',
  },
  {
    target: 'web',
    entry: './test/bundle/main.js',
    output: {
      path: path.join(__dirname, 'test/bundle'),
      filename: 'bundle.js',
    },
    module: {
      rules: [babelLoader],
    },
    mode: 'development',
  },
]
