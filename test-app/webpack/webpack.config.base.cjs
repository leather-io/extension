/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const { version: _version } = require('../../package.json');
const { execSync } = require('child_process');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const getBranch = () => {
  const branch = execSync(`git rev-parse --abbrev-ref HEAD`, { encoding: 'utf8' }).trim();
  return branch;
};

const getCommit = () => {
  const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  return commit;
};

/**
 * For CI builds, we add a random number after the patch version.
 */
const getVersion = () => {
  const branch = getBranch();
  if (!branch || branch.includes('master')) return _version;
  return `${_version}.${Math.floor(Math.floor(Math.random() * 1000))}`;
};

const VERSION = getVersion();
const COMMIT_SHA = getCommit();
const BRANCH = getBranch();

const SRC_ROOT_PATH = path.join(__dirname, '../', 'src');
const DIST_ROOT_PATH = path.join(__dirname, '../', 'dist');
const WALLET_ENVIRONMENT = process.env.WALLET_ENVIRONMENT || 'development';
const WEB_BROWSER = process.env.WEB_BROWSER ? process.env.WEB_BROWSER : 'chrome';
const IS_DEV = WALLET_ENVIRONMENT === 'development';
const IS_PROD = !IS_DEV;

const ANALYZE_BUNDLE = process.env.ANALYZE === 'true';

const APP_TITLE = 'Stacks test app';

const HTML_OPTIONS = {
  inject: 'body',
  title: APP_TITLE,
  chunks: ['index', 'common'],
};

const HTML_PROD_OPTIONS = IS_DEV
  ? HTML_OPTIONS
  : {
      ...HTML_OPTIONS,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    };

const aliases = {
  '@stacks/network/dist/polyfill': '@stacks/network/dist/esm',
  '@stacks/encryption': '@stacks/encryption/dist/esm',
  '@stacks/network': '@stacks/network/dist/esm',
  '@stacks/profile': '@stacks/profile/dist/esm',
  '@stacks/auth': '@stacks/auth/dist/esm',
  'leather-styles': path.resolve('leather-styles'),
};

const config = {
  entry: { index: path.join(SRC_ROOT_PATH, 'index.tsx') },
  output: {
    path: DIST_ROOT_PATH,
    chunkFilename: !IS_DEV ? '[name].[contenthash:8].chunk.js' : IS_DEV && '[name].chunk.js',
    filename: () => {
      if (WALLET_ENVIRONMENT === 'production' || IS_DEV) {
        return '[name].js';
      }
      return '[name].[contenthash:8].js';
    },
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json', '.d.ts'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve('./test-app/tsconfig.json'),
      }),
    ],
    alias: aliases,
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      buffer: require.resolve('buffer/'),
    },
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
      name: 'common',
    },
    runtimeChunk: false,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2020',
            },
          },
        ],
      },
    ],
  },
  devServer: {
    // HMR in test-app interferes with injected code
    // when using the the wallet in dev mode. Injected module updates
    // aren't critical, so we rely instead on a page refresh
    hot: false,
    historyApiFallback: true,
    https: false,
    port: process.env.PORT || 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    client: {
      overlay: false,
    },
    allowedHosts: 'all',
  },
  devtool: 'cheap-module-source-map',
  watch: false,
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/wordlists\/(?!english)/,
      contextRegExp: /bip39\/src$/,
    }),
    new HtmlWebpackPlugin({
      template: path.join(SRC_ROOT_PATH, '../', 'public', 'html', 'index.html'),
      filename: 'index.html',
      ...HTML_PROD_OPTIONS,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(SRC_ROOT_PATH, '../', 'public', 'assets'),
          to: path.join(DIST_ROOT_PATH, 'assets'),
        },
      ],
    }),
    new webpack.DefinePlugin({
      WALLET_ENVIRONMENT: JSON.stringify(WALLET_ENVIRONMENT),
      WEB_BROWSER: JSON.stringify(WEB_BROWSER),
      VERSION: JSON.stringify(VERSION),
      COMMIT_SHA: JSON.stringify(COMMIT_SHA),
      BRANCH: JSON.stringify(BRANCH),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
      fetch: 'cross-fetch',
    }),
  ],
};

if (IS_PROD) {
  config.plugins.push(
    new CleanWebpackPlugin({ verbose: true, dry: false, cleanStaleWebpackAssets: false })
  );
}
if (ANALYZE_BUNDLE) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
