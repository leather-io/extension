import { defineGlobalStyles } from '@pandacss/dev';

// TODO import from '@leather-wallet/tokens'
import { tokens } from '../tokens';

// 4370 TODO audit the use of this file as we are pretty close to not needing it
// - could set some styles in the <Container where radix.css also loaded
// - try make UI things more modular, self contained and independant

// ts-unused-exports:disable-next-line
export const globalCss = defineGlobalStyles({
  // TODO refactor button to include this and add a wrapper for styled.buttons
  button: {
    cursor: 'pointer',
  },
  // #4370 TODO - audit all scroll bars to fix - 4882
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
      height: tokens.sizes.popupHeight.value,
      // setting maxHeight / minHeight stops weird scroll on Session is locked in extension view
      // if set minHeight to 100vh then extension barely opens!
      maxHeight: '100vh',
      // the extension doesn't actually open to POPUP_HEIGHT and if minHeight higher than 600px we can scroll on unlock screen
      minHeight: tokens.sizes.dialogHeight.value,
      width: tokens.sizes.popupWidth.value,
      // scrollbarWidth: 'none',

      // TODO  4882 - make sure this shows properly on windows also
      // TODO 4370 - his was showing scrollbar on chrome connect wallet auth
      // // Only add overflow scroll on non-firefox browsers
      // '@supports not (-moz-appearance: none)': {
      //   overflowY: 'scroll', // TODO 4370 look into disabling this and having it only on page container
      // },

      '::-webkit-scrollbar': {
        display: 'none',
        width: 0,
      },
    },
  },
});
