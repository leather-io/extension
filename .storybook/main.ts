import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';
import remarkGfm from 'remark-gfm';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import Webpack from 'webpack';

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-docs',
      options: {
        csfPluginOptions: null,
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
        transcludeMarkdown: true,
      },
    },
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: ['postcss-preset-env', '@pandacss/dev/postcss'],
                  },
                },
              },
            ],
          },

          {
            test: /\.(ts|tsx)$/,
            loader: 'esbuild-loader',
            options: { tsconfig: './tsconfig.json', target: 'es2020' },
          },
          {
            test: /\.(js)$/,
            include: [/node_modules\/@leather.io\/ui/],
            loader: 'esbuild-loader',
            options: { tsconfig: './tsconfig.json', loader: 'jsx', target: 'es2020' },
          },
        ],
      },
    },
    '@storybook/addon-webpack5-compiler-swc',
    '@chromatic-com/storybook',
  ],
  docs: {},
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {},
    },
  },
  staticDirs: ['../public'],
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  swc: () => ({
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
  }),
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
  },
  webpackFinal: config => {
    config.resolve ??= {};
    config.resolve.fallback ??= {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      os: require.resolve('os-browserify/browser'),
    };
    config.resolve.plugins ??= [];
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      })
    );
    config.plugins ??= [];
    config.plugins.push(
      new Webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        chrome: [path.join(__dirname, '../tests/mocks/mock-chrome.ts'), 'chrome'],
      })
    );
    config.module ??= {};
    config.module.rules ??= [];
    // This modifies the existing image rule to exclude `.svg` files
    // so we can load it instead with @svgr/webpack
    const imageRule = config.module.rules.find((rule: any) => {
      if (rule && typeof rule !== 'string' && rule.test instanceof RegExp) {
        return rule.test.test('.svg');
      }
    });
    if (imageRule && typeof imageRule !== 'string') {
      imageRule.exclude = /\.svg$/;
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });
    return config;
  },
};
export default config;
