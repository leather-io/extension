import { config as baseConfig } from './webpack.config.base.js';

export default {
  ...baseConfig,
  devtool: 'inline-source-map',
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
