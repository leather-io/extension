import { css } from '@emotion/react';

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
      overflow-y: scroll;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
`;
