const avoidWindowOpenMsg = 'Use `openInNewTab` helper';
const avoidFetchMsg = 'Use `axios` instead for consistency with the rest of the project';

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
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
    'plugin:storybook/csf',
  ],
  ignorePatterns: ['./leather-styles'],
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-console': ['error'],
    'no-duplicate-imports': ['error'],
    'prefer-const': [
      'error',
      {
        ignoreReadBeforeAssign: false,
      },
    ],
    'no-restricted-globals': [
      'error',
      { name: 'open', message: avoidWindowOpenMsg },
      { name: 'fetch', message: avoidFetchMsg },
    ],
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
      {
        object: 'window',
        property: 'close',
        message: 'Use `closeWindow` utility helper',
      },
      {
        object: 'window',
        property: 'fetch',
        message: avoidFetchMsg,
      },
    ],
    '@typescript-eslint/no-floating-promises': ['warn'],
    '@typescript-eslint/no-unnecessary-type-assertion': ['warn'],
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unsafe-assignment': [0],
    '@typescript-eslint/no-unsafe-return': [0],
    '@typescript-eslint/no-unsafe-call': [0],
    '@typescript-eslint/no-unsafe-member-access': [0],
    '@typescript-eslint/restrict-template-expressions': [0],
    '@typescript-eslint/explicit-module-boundary-types': [0],
    '@typescript-eslint/no-unnecessary-type-constraint': ['off'],
    '@typescript-eslint/no-non-null-asserted-optional-chain': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-meaningless-void-operator': 'error',
    '@typescript-eslint/ban-types': ['error'],
    // This rule is off until we can enable tsconfig noUncheckedIndexedAccess
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/array-type': ['error'],
    '@typescript-eslint/method-signature-style': ['error', 'method'],
    'no-warning-comments': [0],

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': ['error'],

    'react/function-component-definition': 'error',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['test/**', 'src/**/*.spec.ts'],
      rules: {
        'no-console': [0],
      },
    },
    {
      files: ['src/**/*'],
      excludedFiles: 'src/app/store/**',
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'react-redux',
                importNames: ['useSelector'],
                message: 'Selectors must be exported from the store via a hook',
              },
              {
                name: '@radix-ui/themes',
                importNames: ['Flex'],
                message: 'Layout components should be imported from leather-styles/jsx',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['*.mdx'],
      extends: 'plugin:mdx/recommended',
    },
  ],
};
