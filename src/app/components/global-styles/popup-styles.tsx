import { css } from '@emotion/react';

import { hideScrollbarStyle } from './hide-scrollbar';

const maxWidth = '392px';
const maxHeight = '600px';

export const popupStyles = css`
  .mode__popup {
    &,
    html,
    body {
      min-width: ${maxWidth};
      max-width: ${maxWidth};
      min-height: ${maxHeight};
      max-height: ${maxHeight};
      scrollbar-width: none;

      // Only add overflow scroll on non-firefox browsers
      @supports not (-moz-appearance: none) {
        overflow-y: scroll;
      }

      ${hideScrollbarStyle}
    }
  }
`;
