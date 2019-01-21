const path = require('path');
const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = mode => ({
  cache: true,
  mode: 'development',
  entry: {
    'shared-code-editor.bundle': ['babel-polyfill', './src/browser.js'],
  },
  output: {
    path: path.join(__dirname, 'lib'),
    publicPath: '/lib/',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'src')],
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'src')],
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: mode === 'development' ? [
    new webpack.HotModuleReplacementPlugin(),
    new MonacoWebpackPlugin(),
  ] : [],
  devServer: {
    hot: true,
    historyApiFallback: true,
    contentBase: '.',
    publicPath: '/assets/',
  },
});