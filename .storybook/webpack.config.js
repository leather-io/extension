const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = ({ config }) => {
  const plugins = config.resolve.plugins || []
  plugins.push(new TsconfigPathsPlugin())
  config.resolve.plugins = plugins
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: path.resolve(__dirname, "../src/ts"),
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: false,
          babelrc: false,
          presets: [
            [
              "@babel/preset-env",
              { targets: { browsers: "last 2 versions" } } // or whatever your project requires
            ],
            "@babel/preset-typescript",
            "@babel/preset-react"
          ],
          plugins: [
            // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
            // ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
            "react-hot-loader/babel",
            "@babel/plugin-transform-runtime",
            ["react-docgen", { DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES' }]
          ]
        }
      },
      // Optional
      {
        loader: require.resolve('react-docgen-typescript-loader'),
        options: {
          tsconfigPath: path.join(__dirname, "../tsconfig.json"),
          propFilter: (prop) => {
            // console.log(prop);
            return true;
          }
        },
      }
    ],
  });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};