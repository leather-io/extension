/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('./webpack.config.base');

const config = {
  ...baseConfig,
  devtool: 'eval-cheap-module-source-map',
  mode: 'development',
  output: {
    ...baseConfig.output,
    pathinfo: false,
    chunkFilename: '[name].chunk.js',
    filename: '[name].js',
    publicPath: '/',
  },
  optimization: {
    minimize: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
};

module.exports = config;
