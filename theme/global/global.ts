import { defineGlobalStyles } from '@pandacss/dev';

import { tokens } from '@leather.io/tokens';

// ts-unused-exports:disable-next-line
export const globalCss = defineGlobalStyles({
  button: {
    cursor: 'pointer',
  },
  'html, body': {
    backgroundColor: 'ink.background-primary',
  },
  html: {
    // adding to always not show scroll bar for windows Chrome
    '::-webkit-scrollbar': {
      display: 'none',
      width: 0,
    },
  },
  body: {
    '&.no-scroll, &.no-scroll .main-content': {
      overflow: 'hidden',
    },
  },
  '.mode__full-page': {
    '&, body, main, .radix-themes': {
      height: '100%',
      maxHeight: 'unset',
      width: '100%',
    },
    '.main-content': {
      flexGrow: 1,
      justifyContent: 'center',
      margin: '0 auto',
    },
  },
  '.mode__popup': {
    '&, body': {
      height: '100%',
      width: '100%',
      minHeight: tokens.sizes.dialogHeight.value,
      maxWidth: tokens.sizes.popupMaxWidth.value,
      margin: '0 auto',
    },
    '#app, .radix-themes': {
      height: '100%',
    },
  },
  '.mode__action-popup': {
    'html,body': {
      minWidth: tokens.sizes.popupWidth.value,
      maxWidth: tokens.sizes.popupWidth.value,
      minHeight: tokens.sizes.dialogHeight.value,
      maxHeight: tokens.sizes.dialogHeight.value,
      margin: '0 auto',
    },
  },
});
