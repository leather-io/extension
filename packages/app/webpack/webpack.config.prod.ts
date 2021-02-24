// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as webpack from 'webpack';
import baseConfig, { DIST_ROOT_PATH } from './webpack.config';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const config: webpack.Configuration = {
  ...baseConfig,
  mode: 'production',
  output: {
    path: DIST_ROOT_PATH,
    chunkFilename: '[name].[contenthash:8].chunk.js',
    filename: '[name].[contenthash:8].js',
  },
  devtool: false,
  plugins: [
    ...baseConfig.plugins,
    new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/),
    new CleanWebpackPlugin({ verbose: true, dry: false, cleanStaleWebpackAssets: false }),
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      name: 'common',
    },
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
  },
};
export default config;
