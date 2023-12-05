/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.config.base');
const packageJson = require('../package.json');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const webpack = require('webpack');

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;

config.mode = 'production';

config.optimization = {
  ...config.optimization,
  minimize: false,
  moduleIds: 'deterministic',
  splitChunks: {
    maxSize: process.env.TARGET_BROWSER === 'firefox' ? 3500000 : undefined,
    chunks(chunk) {
      return chunk.name === 'index';
    },
    hidePathInfo: false,
    minSize: 10000,
    maxAsyncRequests: Infinity,
    maxInitialRequests: Infinity,
  },
};

config.plugins = [
  ...config.plugins,
  new webpack.SourceMapDevToolPlugin({
    // These entry points are excuted in an app's context. If we generate source
    // maps for them, the browser attempts to load them from the inaccessible
    // `chrome-extension://` protocol, throwing console errors. To prevent
    // these, we do not generate source maps for these files. Otherwise, these
    // `SourceMapDevToolPlugin` options emulate the `devtool: source-map` config
    exclude: [/inpage/, /content\-script/, /browser\-polyfill/],
    filename: '[file].map',
  }),
  ...(sentryAuthToken
    ? [
        sentryWebpackPlugin({
          org: 'trust-machines',
          project: 'leather',

          // Specify the directory containing build artifacts
          include: './dist',

          // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
          // and needs the `project:releases` and `org:read` scopes
          authToken: sentryAuthToken,

          release: {
            name: packageJson.version,
          },
        }),
      ]
    : []),
];

config.devtool = false;

module.exports = config;
