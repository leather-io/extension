/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.config.base');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const shouldMinify = JSON.parse(process.env.MINIFY_PRODUCTION_BUILD || false);
const package = require('../package.json');

config.mode = 'production';

// Basically, disable any code splitting stuff
config.optimization = {
  ...config.optimization,
  flagIncludedChunks: false,
  concatenateModules: false,
  minimize: shouldMinify,
  moduleIds: 'deterministic',
  splitChunks: {
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

config.devtool = 'source-map';

if (
  process.env.CI &&
  (process.env.WALLET_ENVIRONMENT === 'production' ||
    process.env.WALLET_ENVIRONMENT === 'development')
) {
  console.log('Using Sentry Sourcemap plugin');
  config.plugins = [
    ...config.plugins,
    new SentryCliPlugin({
      include: 'dist',
      ignore: ['node_modules'],
      release: package.version,
    }),
  ];
}

module.exports = config;
