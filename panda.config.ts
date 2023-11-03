import { defineConfig } from '@pandacss/dev';

import myPreset from './theme/base';
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

  // https://panda-css.com/docs/customization/presets
  // https://blog.logrocket.com/dark-mode-react-in-depth-guide/#using-system-settings

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
  // layers: {
  //   base: myPreset
  // }
  // layers: {
  //   base: 'panda_base',
  // },
  outdir: 'leather-styles',
  outExtension: 'js',
  minify: true,
  globalCss,
});
