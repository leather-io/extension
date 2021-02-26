import { Configuration } from 'webpack';
import baseConfig, { DIST_ROOT_PATH } from './webpack.config';

const config: Configuration = {
  ...baseConfig,
  mode: 'development',
  output: {
    pathinfo: false,
    path: DIST_ROOT_PATH,
    chunkFilename: '[name].chunk.js',
    filename: '[name].js',
  },
  optimization: {
    minimize: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  devtool: 'eval-source-map',
};

export default config;
