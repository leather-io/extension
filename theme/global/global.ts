import { defineGlobalStyles } from '@pandacss/dev';

import { fullPageStyles } from './full-page-styles';
import { popupCenterStyles } from './popup-center-styles';
import { popupStyles } from './popup-styles';

// ts-unused-exports:disable-next-line
export const globalCss = defineGlobalStyles({
  'html, body': {
    backgroundColor: 'ink.background-primary',
  },
  button: {
    cursor: 'pointer',
  },
  '@media (min-width: 600px)': {
    'html, body': {
      backgroundColor: 'ink.background-secondary',
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
});
