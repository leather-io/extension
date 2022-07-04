/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.config.base');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

const shouldMinify = JSON.parse(process.env.MINIFY_PRODUCTION_BUILD || false);

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

config.devtool = 'source-map';

module.exports = config;
