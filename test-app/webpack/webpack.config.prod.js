/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.config.base');

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
};

config.devtool = false;

module.exports = config;
