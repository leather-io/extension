/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('./webpack.config.base');

const config = {
  ...baseConfig,
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    ...baseConfig.output,
    pathinfo: false,
    chunkFilename: '[name].chunk.js',
    filename: '[name].js',
  },
  optimization: {
    minimize: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
    runtimeChunk: 'single',
  },
};

module.exports = config;
