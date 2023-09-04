import { defineConfig } from '@pandacss/dev';

import { breakpoints } from './theme/breakpoints';
import { globalCss } from './theme/global/global';
import { keyframes } from './theme/keyframes';
import { buttonRecipe } from './theme/recipes/button';
import { semanticTokens } from './theme/semantic-tokens';
import { tokens } from './theme/tokens';
import { textStyles } from './theme/typography';

export default defineConfig({
  preflight: true,

  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  exclude: [],

  prefix: 'leather',

  presets: [],

  studio: { logo: '💼' },

  jsxFramework: 'react',

  strictTokens: false,

  theme: {
    extend: {
      semanticTokens,
      tokens,
      keyframes,
      textStyles,
      breakpoints,
      recipes: { button: buttonRecipe },
    },
  },
  outdir: 'leather-styles',
  outExtension: 'js',
  minify: true,
  globalCss,
});
