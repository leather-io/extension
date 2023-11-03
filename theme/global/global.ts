import { defineGlobalStyles } from '@pandacss/dev';

import { semanticTokens } from '../semantic-tokens';
import { tokens } from '../tokens';
import { fullPageStyles } from './full-page-styles';
import { popupCenterStyles } from './popup-center-styles';
import { popupStyles } from './popup-styles';
import { radixStyles, radixTabStyles } from './radix-styles';
import { tippyStyles } from './tippy-styles';

// token('colors.accent.background-secondary');

// Will still flash wrong colour here if not set in base.css
// go for a simple PR with hardcoded colors before figure out base.css overrides
// ts-unused-exports:disable-next-line
export const globalCss = defineGlobalStyles({
  'html, body': {
    backgroundColor: 'red',
    // backgroundColor: '#2c2a24',
    // backgroundColor: 'accent.background-secondary',
    // backgroundColor: 'accent.background-primary',
    // backgroundColor: 'colors.darkMode.brown.2',
    // backgroundColor: '#2c2a24',
    // bg: { base: 'white', _dark: '#2c2a24' },
  },
  button: {
    cursor: 'pointer',
  },
  // '@media (prefers-color-scheme: dark)': {
  //   'html, body, #app': {
  //     backgroundColor: '#2c2a24',
  //   },
  // },
  '@media (min-width: 600px)': {
    'html, body': {
      // backgroundColor: 'accent.background-secondary',
    },
  },
  html: {
    // backgroundColor: '#2c2a24',
    // backgroundColor: semanticTokens.colors.accent['background-secondary'].value,
    // backgroundColor: 'accent.background-secondary',
  },

  body: {
    // backgroundColor: semanticTokens.colors.accent['background-secondary'].value,
    // okens.colors.darkModeBrown[2]
    // backgroundColor: 'accent.background-secondary',
    '&.no-scroll, &.no-scroll .main-content': {
      overflow: 'hidden',
    },
  },
  ...fullPageStyles,
  ...popupStyles,
  ...popupCenterStyles,
  ...tippyStyles,
  ...radixStyles,
  ...radixTabStyles,
});
