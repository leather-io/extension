import { defineGlobalStyles } from '@pandacss/dev';

import { fullPageStyles } from './full-page-styles';
import { popupCenterStyles } from './popup-center-styles';
import { popupStyles } from './popup-styles';
import { radixStyles, radixTabStyles } from './radix-styles';
import { tippyStyles } from './tippy-styles';

export const globalCss = defineGlobalStyles({
  'html, body': {
    backgroundColor: 'accent.background-secondary',
  },
  button: {
    cursor: 'pointer',
  },
  button: {
    cursor: 'pointer',
  },
  '@media (min-width: 600px)': {
    'html, body': {
      backgroundColor: 'accent.background-secondary',
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
