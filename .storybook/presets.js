const path = require('path')

const ts = {
  name: '@storybook/preset-typescript',
  options: {
    tsDocgenLoaderOptions: {
      tsconfigPath: path.resolve(__dirname, "../tsconfig.json")
    },
    include: [path.resolve(__dirname, "../src/ts")],
    transpileManager: true
  }
};

module.exports = ['@storybook/addon-docs/react/preset'];