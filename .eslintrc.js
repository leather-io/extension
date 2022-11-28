const avoidWindowOpenMsg = 'Use `openInNewTab` helper';

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    page: true,
    browser: true,
    context: true,
  },
  plugins: ['react-hooks', '@typescript-eslint', 'deprecation'],
  rules: {
    // This rule helps highlight areas of the code that use deprecated
    // methods, such as implicit use of signed transactions
    'deprecation/deprecation': 'warn',
    'no-console': ['error'],
    'prefer-const': [
      'error',
      {
        ignoreReadBeforeAssign: false,
      },
    ],
    'no-restricted-globals': ['error', { name: 'open', message: avoidWindowOpenMsg }],
    'no-restricted-properties': [
      'error',
      {
        object: 'window',
        property: 'open',
        message: avoidWindowOpenMsg,
      },
      {
        object: 'globalThis',
        property: 'open',
        message: avoidWindowOpenMsg,
      },
    ],
    '@typescript-eslint/no-floating-promises': [1],
    '@typescript-eslint/no-unnecessary-type-assertion': [0],
    '@typescript-eslint/no-unsafe-assignment': [0],
    '@typescript-eslint/no-unsafe-return': [0],
    '@typescript-eslint/no-unsafe-call': [0],
    '@typescript-eslint/no-unsafe-member-access': [0],
    '@typescript-eslint/ban-types': [0],
    '@typescript-eslint/restrict-template-expressions': [0],
    '@typescript-eslint/explicit-module-boundary-types': [0],
    'no-warning-comments': [0],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: 'useRecoilCallback',
      },
    ],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: 'src/**/*.spec.ts',
      rules: {
        'no-console': [0],
      },
    },
  ],
};
