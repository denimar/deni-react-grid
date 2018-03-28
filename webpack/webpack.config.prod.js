const webpack = require('webpack');
const path = require('path');
const loaders = require('./loaders');

const SOURCE_FOLDER = path.resolve(__dirname, '../src');
const BUILD_FOLDER = path.resolve(__dirname, '../build');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const plugins = [];
plugins.push(new CleanWebpackPlugin([BUILD_FOLDER]));

module.exports = {
  mode: 'production',
  entry: SOURCE_FOLDER + '/components/DataGrid/DataGrid.js',
  output: {
    path: BUILD_FOLDER,
    filename: 'deni-react-grid.js',
    library: 'DeniReactGrid',
    libraryTarget: 'umd'
  },
  module: {
    rules: loaders
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
