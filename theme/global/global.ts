import { defineGlobalStyles } from '@pandacss/dev';

import { fullPageStyles } from './full-page-styles';
import { popupCenterStyles } from './popup-center-styles';
import { popupStyles } from './popup-styles';
import { radixStyles, radixTabStyles } from './radix-styles';
import { tippyStyles } from './tippy-styles';

// ts-unused-exports:disable-next-line
export const globalCss = defineGlobalStyles({
  'html, body': {
    backgroundColor: 'accent.background-primary',
  },
  // 'html.light': {
  //   backgroundColor: 'red !important',
  // },

  // 'html.dark': {
  //   backgroundColor: 'blue !important',
  // },
  button: {
    cursor: 'pointer',
  },
  '@media (min-width: 600px)': {
    'html, body': {
      // this actually sets the BG
      backgroundColor: 'accent.background-secondary',
      // '@media (prefers-color-scheme: light)': {
      //   backgroundColor: 'accent.background-secondary',
      // },
      // '@media (prefers-color-scheme: dark)': {
      //   backgroundColor: 'accent.background-secondary',
      // },
    },
  },
  body: {
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
