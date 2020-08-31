const esbuild = require('rollup-plugin-esbuild');

module.exports = {
  rollup(config, options) {
    // config.plugins.map(plugin => {
    //   if (plugin && plugin.name === 'rpt2') {
    //     return esbuild({
    //       // All options are optional
    //       include: /\.[jt]sx?$/, // default, inferred from `loaders` option
    //       exclude: [
    //         // all TS test files, regardless whether co-located or in test/ etc
    //         '**/*.spec.ts',
    //         '**/*.test.ts',
    //         '**/*.spec.tsx',
    //         '**/*.test.tsx',
    //         // TS defaults below
    //         'node_modules',
    //         'bower_components',
    //         'jspm_packages',
    //         'dist',
    //       ],
    //       watch: process.argv.includes('--watch'),
    //       sourceMap: false, // default
    //       minify: process.env.NODE_ENV === 'production',
    //       target: 'esnext', // default, or 'es20XX', 'esnext'
    //       jsxFactory: 'React.createElement',
    //       jsxFragment: 'React.Fragment',
    //       // Add extra loaders
    //       loaders: {
    //         // Add .json files support
    //         // require @rollup/plugin-commonjs
    //         '.json': 'json',
    //         // Enable JSX in .js files too
    //         '.js': 'jsx',
    //         '.ts': 'tsx',
    //       },
    //     });
    //   }
    //   return plugin;
    // });
    if (options.format === 'esm') {
      config = { ...config, preserveModules: true };
      config.output = { ...config.output, dir: 'dist/', entryFileNames: '[name].esm.js' };
      delete config.output.file;
    }
    return config;
  },
};
