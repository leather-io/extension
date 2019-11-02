const TSDocgenPlugin = require('react-docgen-typescript-webpack-plugin');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
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
            "@babel/plugin-transform-runtime"
          ]
        }
      },
      // Optional
      require.resolve('react-docgen-typescript-loader')
    ],
  });
  // config.plugins.push(new TSDocgenPlugin())
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};