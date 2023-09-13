const maxWidth = '392px';
const maxHeight = '600px';

export const popupStyles = {
  '.mode__popup': {
    'html,body': {
      minWidth: maxWidth,
      maxWidth: maxWidth,
      minHeight: maxHeight,
      maxHeight: maxHeight,
      scrollbarWidth: 'none',

      // Only add overflow scroll on non-firefox browsers
      '@supports not (-moz-appearance: none)': {
        overflowY: 'scroll',
      },

      '::-webkit-scrollbar': {
        display: 'none',
        width: 0,
      },
    },
  },
};
