import type { StorybookConfig } from '@storybook/react-webpack5';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
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
        ],
      },
    },
  ],
  docs: {
    autodocs: 'tag',
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
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
    config.resolve.plugins ??= [];
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      })
    );
    return config;
  },
};
export default config;
