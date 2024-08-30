import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';
import remarkGfm from 'remark-gfm';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import Webpack, { RuleSetRule } from 'webpack';

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
  docs: {
    autodocs: 'tag',
  },
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
    config.resolve.plugins ??= [];
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      })
    );

    config.module ??= {};
    config.module.rules ??= [];
    const assetRule = config.module.rules.find(({ test }) => test.test(".svg"));

    const assetLoader = {
      loader: assetRule?.loader,
      options: assetRule?.options || assetRule?.query
    };
    // Merge our rule with existing assetLoader rules
      config.module.rules.unshift({
        test: /\.svg$/,
        use: ["@svgr/webpack", assetLoader]
      });

    // config.module ??= {};
    // config.module.rules ??= [];
    // // disable whatever is already set to load SVGs
    // config.module.rules
    //   .filter((rule): rule is RuleSetRule => 
    //     typeof rule === 'object' && rule !== null && 'test' in rule && 
    //     typeof rule.test === 'function' && rule.test('.svg')
    //   )
    //   .forEach(rule => {
    //     if (typeof rule.exclude === 'undefined') {
    //       rule.exclude = /\.svg$/i;
    //     } else if (rule.exclude instanceof RegExp) {
    //       rule.exclude = new RegExp(rule.exclude.source + '|' + /\.svg$/i.source, 'i');
    //     } else if (Array.isArray(rule.exclude)) {
    //       rule.exclude.push(/\.svg$/i);
    //     }
    //   });
    //   // add SVGR instead
    // config.module.rules.push({
    //   test: /\.svg$/,
    //   use: [
    //     {
    //       loader: '@svgr/webpack'
    //     },
    //     {
    //       loader: 'file-loader',
    //       options: {
    //         name: 'static/media/[path][name].[ext]'
    //       }
    //     }
    //   ],
    //   type: 'javascript/auto',
    //   issuer: {
    //     and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
    //   }
    // });
  
    config.plugins ??= [];
    config.plugins.push(
      new Webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        chrome: [path.join(__dirname, '../tests/mocks/mock-chrome.ts'), 'chrome'],
      })
    );
    return config;
  },
};
export default config;
