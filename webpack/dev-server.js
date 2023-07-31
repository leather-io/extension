const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');

const WALLET_ENVIRONMENT = process.env.WALLET_ENVIRONMENT;

const HOST = 'localhost';
const PORT = process.env.PORT || '8080';

const config = require('./webpack.config.dev');

// This is important bc it allows for fast refresh to work
// We don't want to inject our fast refresh helpers into these entry points
const excludeEntriesFromHotModuleReload = ['content-script', 'inpage'];

Object.keys(config.entry).forEach(entryName => {
  if (!excludeEntriesFromHotModuleReload.includes(entryName) && config.entry) {
    config.entry[entryName] = [
      `webpack-dev-server/client?hot=true&live-reload=true&logging=none&hostname=${HOST}&port=${PORT}`,
      'webpack/hot/dev-server',
    ].concat(config.entry[entryName]);
  }
});

config.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new ReactRefreshWebpackPlugin({ overlay: false }),
].concat(config.plugins || []);

const compiler = webpack(config);

const server = new WebpackDevServer(
  {
    https: false,
    webSocketServer: 'ws',
    // Disabled as web configure manually above
    hot: false,
    // We disable client bc we do a manual setup for specific entries
    client: false,
    port: process.env.PORT,
    static: {
      directory: path.join(__dirname, '../build'),
    },
    headers: { 'Access-Control-Allow-Origin': '*' },
    allowedHosts: 'all',
    devMiddleware: {
      publicPath: `http://localhost:${process.env.PORT}`,
      stats: 'errors-only',
      writeToDisk: true,
    },
  },
  compiler
);

if (WALLET_ENVIRONMENT === 'development' && module.hot) {
  module.hot.accept();
}

server.startCallback(() => {
  console.log('Starting server on http://localhost:8080');
});
