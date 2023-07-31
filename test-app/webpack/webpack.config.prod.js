/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.config.base');
const { EsbuildPlugin } = require('esbuild-loader');

// Basically, disable any code splitting stuff
config.optimization = {
  ...config.optimization,
  flagIncludedChunks: false,
  concatenateModules: false,
  minimize: process.env.WALLET_ENVIRONMENT !== 'testing',
  moduleIds: 'deterministic',
  splitChunks: {
    hidePathInfo: false,
    minSize: 10000,
    maxAsyncRequests: Infinity,
    maxInitialRequests: Infinity,
  },
  minimizer: [
    new EsbuildPlugin({
      target: 'es2020',
      tsconfigRaw: require('../tsconfig.json'),
    }),
  ],
};

config.devtool = false;

module.exports = config;
