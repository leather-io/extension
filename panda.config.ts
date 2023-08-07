import { defineConfig } from '@pandacss/dev';

import { keyframes } from './theme/keyframes';
import { semanticTokens } from './theme/semantic-tokens';
import { tokens } from './theme/tokens';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  jsxFramework: 'react',

  // Useful for theme customization
  theme: {
    extend: {
      semanticTokens,
      tokens,
      keyframes,
    },
  },
  // The output directory for your css system
  outdir: 'leaf-styles',
  outExtension: 'js',
});
