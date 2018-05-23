const webpack = require('webpack');
const path = require('path');
const loaders = require('./loaders');

const SOURCE_FOLDER = path.resolve(__dirname, '../gh-pages');

module.exports = {
  mode: 'development',
  entry: SOURCE_FOLDER + '/App.jsx',
  output: {
    path: SOURCE_FOLDER,
    filename: 'bundle.js'
  },
  devtool: 'source-maps',
  module: {
    rules: loaders
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    contentBase: SOURCE_FOLDER,
    compress: true,
    port: 3012,
    hot: true,
    progress: true,
    open: true
  }
};
