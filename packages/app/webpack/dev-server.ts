// @ts-nocheck
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.ASSET_PATH = '/';
process.env.PORT = '8080';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import WebpackDevServer from 'webpack-dev-server';
import * as webpack from 'webpack';
import * as path from 'path';
import _config from './webpack.config.dev';

const config: webpack.Configuration = _config;

// This is important, allows for fast refresh to work
// we don't want to inject our fast refresh helpers into everything
const excludeEntriesToHotReload = ['message-bus.js'];

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || '8080';

Object.keys(config.entry).forEach(entryName => {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1 && config.entry) {
    config.entry[entryName] = [
      'webpack-dev-server/client?http://localhost:' + PORT,
      'webpack/hot/dev-server',
    ].concat(config.entry[entryName]);
  }
});

config.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new ReactRefreshWebpackPlugin({
    overlay: {
      entry: '@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry',
      module: '@pmmmwh/react-refresh-webpack-plugin/overlay',
      sockIntegration: 'wds',
      sockProtocol: 'ws',
      sockHost: 'localhost',
      sockPort: 8080,
    },
  }),
].concat(config.plugins || []);

const compiler = webpack.webpack(config);

const server = new WebpackDevServer(compiler, {
  https: false,
  transportMode: 'ws',
  hot: true,
  injectClient: false,
  writeToDisk: true,
  port: process.env.PORT,
  contentBase: path.join(__dirname, '../build'),
  publicPath: `http://localhost:${process.env.PORT}`,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  disableHostCheck: true,
});

if (NODE_ENV === 'development' && (module as any).hot) {
  (module as any).hot.accept();
}

server.listen(process.env.PORT);
