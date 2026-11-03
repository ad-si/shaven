const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// TypeScript 7 has no JavaScript API for loaders,
// therefore Babel strips the types and `tsc` only does the type checking.
const typescriptLoader = {
  test: /\.ts$/,
  loader: 'babel-loader',
  options: {
    presets: [
      '@babel/preset-env',
      '@babel/preset-typescript',
    ],
  },
}

const resolve = {
  extensions: ['.ts', '.js'],
}

module.exports = [
  {
    target: 'web',
    entry: './source/scripts/main.ts',
    output: {
      path: path.join(__dirname, '/site/scripts'),
      filename: 'bundle.js',
    },
    resolve,
    module: {
      rules: [
        typescriptLoader,
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
    // Standalone bundle which exposes `shaven` as a global variable
    target: 'web',
    entry: './source/library/browser.ts',
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'shaven.js',
      library: {
        name: 'shaven',
        type: 'var',
        export: 'default',
      },
    },
    resolve,
    module: {
      rules: [typescriptLoader],
    },
    mode: 'production',
  },
  {
    target: 'web',
    entry: './test/bundle/main.ts',
    output: {
      path: path.join(__dirname, 'test/bundle'),
      filename: 'bundle.js',
    },
    resolve,
    module: {
      rules: [typescriptLoader],
    },
    mode: 'development',
  },
]
