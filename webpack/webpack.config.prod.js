/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.config.base');
const package = require('../package.json');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

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
          new ESBuildMinifyPlugin({
            target: 'esnext',
          }),
        ],
      }
    : {}),
};

config.plugins = [
  ...config.plugins,
  ...(sentryAuthToken
    ? [
        new SentryWebpackPlugin({
          org: 'trust-machines',
          project: 'hiro-wallet',

          // Specify the directory containing build artifacts
          include: './dist',

          // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
          // and needs the `project:releases` and `org:read` scopes
          authToken: sentryAuthToken,

          release: package.version,
        }),
      ]
    : []),
];

config.devtool = 'source-map';

module.exports = config;
