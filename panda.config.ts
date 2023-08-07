import { defineConfig } from '@pandacss/dev';

import { semanticTokens } from './theme/semantic-tokens';
import { tokens } from './theme/tokens';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      semanticTokens,
      tokens,
    },
  },
  // The output directory for your css system
  outdir: 'styled-system',
  outExtension: 'js',
});
