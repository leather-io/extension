/* eslint-disable @typescript-eslint/no-var-requires */

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.ASSET_PATH = '/';
process.env.PORT = '3000';

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');

const config = require('./webpack.config.dev');

// This is important, allows for fast refresh to work
// we don't want to inject our fast refresh helpers into everything
const excludeEntriesToHotReload = [];

const NODE_ENV = process.env.NODE_ENV;

const HOST = 'localhost'
const PORT = process.env.PORT || '3000';

Object.keys(config.entry).forEach(entryName => {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1 && config.entry) {
    config.entry[entryName] = [
      `webpack-dev-server/client?hot=true&live-reload=true&hostname=${HOST}&port=${PORT}`,
      'webpack/hot/dev-server',
    ].concat(config.entry[entryName]);
  }
});

config.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new ReactRefreshWebpackPlugin({ overlay: false }),
].concat(config.plugins || []);

const compiler = webpack(config);

const server = new WebpackDevServer({
  https: false,
  webSocketServer: 'ws',
  // We disable hot bc we do a manual setup for specific entries
  hot: false,
  // We disable client bc we do a manual setup for specific entries
  client: false,
  port: process.env.PORT,
  static: {
    directory: path.join(__dirname, '../build'),
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  allowedHosts: "all",
  devMiddleware: {
    publicPath: `http://localhost:${process.env.PORT}`,
    stats: 'errors-only',
    writeToDisk: true,
  },
}, compiler);

if (NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

server.startCallback(() => {
  console.log("Starting server on http://localhost:3000");
});
