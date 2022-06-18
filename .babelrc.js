module.exports = api => {
  api.cache(true);
  return {
    presets: [
      '@babel/preset-typescript',
      ['@babel/preset-env', { targets: { browsers: 'last 2 versions' } }],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
          importSource: '@emotion/react',
        },
      ],
    ],
    plugins: [
      '@emotion',
      ['@babel/plugin-proposal-class-properties', { loose: false }],
      '@babel/plugin-transform-runtime',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
      process.env.NODE_ENV === 'development' && require.resolve('react-refresh/babel'),
    ].filter(Boolean),
  };
};
