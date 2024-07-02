import { tokens } from '@leather.io/tokens';
import { defineGlobalStyles } from '@pandacss/dev';

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
    'html,body, #app, .radix-themes': {
      maxHeight: '100vh',
      minHeight: tokens.sizes.dialogHeight.value,
      width: tokens.sizes.popupWidth.value,
      margin: '0 auto',

      '::-webkit-scrollbar': {
        display: 'none',
        width: 0,
      },
    },
  },
});
