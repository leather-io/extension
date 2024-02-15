import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import path from 'path';
import * as url from 'url';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import config from './webpack.config.dev.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const HOST = 'localhost';
const PORT = process.env.PORT || '8080';

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

server.startCallback(() => {
  console.log('Starting server on http://localhost:8080');
});
