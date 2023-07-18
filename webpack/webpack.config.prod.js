/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.config.base');
const packageJson = require('../package.json');
const { EsbuildPlugin } = require('esbuild-loader');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const webpack = require('webpack');

const shouldMinify = JSON.parse(process.env.MINIFY_PRODUCTION_BUILD || false);
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;

config.mode = 'production';

// Basically, disable any code splitting stuff
config.optimization = {
  ...config.optimization,
  minimize: shouldMinify,
  moduleIds: 'deterministic',
  splitChunks: {
    chunks(chunk) {
      // Only enable code splitting on main bundle
      return chunk.name === 'index';
    },
    hidePathInfo: false,
    minSize: 10000,
    maxAsyncRequests: Infinity,
    maxInitialRequests: Infinity,
  },
  ...(shouldMinify
    ? {
        minimizer: [
          new EsbuildPlugin({
            target: 'esnext',
          }),
        ],
      }
    : {}),
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
          project: 'hiro-wallet',

          // Specify the directory containing build artifacts
          include: './dist',

          // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
          // and needs the `project:releases` and `org:read` scopes
          authToken: sentryAuthToken,

          release: packageJson.version,
        }),
      ]
    : []),
];

config.devtool = false;

module.exports = config;
