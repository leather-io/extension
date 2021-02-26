import { Configuration, IgnorePlugin } from 'webpack';
import baseConfig, { DIST_ROOT_PATH } from './webpack.config';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { ESBuildMinifyPlugin } from 'esbuild-loader';

const config: Configuration = {
  ...baseConfig,
  mode: 'production',
  output: {
    path: DIST_ROOT_PATH,
    chunkFilename: '[name].chunk.js',
    filename: '[name].js',
  },
  devtool: false,
  plugins: [
    ...(baseConfig.plugins as any),
    new IgnorePlugin({
      resourceRegExp: /^\.\/wordlists\/(?!english)/,
      contextRegExp: /bip39\/src$/,
    }),
    new CleanWebpackPlugin({ verbose: true, dry: false, cleanStaleWebpackAssets: false }),
  ],
  optimization: {
    minimize: true,
    flagIncludedChunks: false,
    // occurrenceOrder: false,
    concatenateModules: false,
    splitChunks: {
      minSize: 10000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
    },
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015',
      }),
    ],
    runtimeChunk: false,
  },
};

export default config;
