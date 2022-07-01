/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.config.base');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

const shouldMinify = JSON.parse(process.env.MINIFY_PRODUCTION_BUILD || false);

config.mode = 'production';

// Basically, disable any code splitting stuff
config.optimization = {
  ...config.optimization,
  // flagIncludedChunks: false,
  // concatenateModules: false,
  minimize: shouldMinify,
  moduleIds: 'deterministic',
  splitChunks: {
    chunks(chunk) {
      return chunk.name !== 'background';
    },
    // hidePathInfo: false,
    // minSize: 10000,
    // maxAsyncRequests: Infinity,
    // maxInitialRequests: Infinity,
    // cacheGroups: {
    //   commons: {
    //     test: /[\\/]node_modules[\\/]/,
    //     name: 'vendors',
    //     chunks: 'all',
    //   },l
    // },
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
