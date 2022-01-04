import { css } from '@emotion/react';

export const extensionStyles = css`
  .mode__popup {
    &,
    body {
      min-height: 600px !important;
      min-width: 392px !important;
      overflow-x: hidden;
      main.main-content {
        flex-grow: 1;
        max-width: 392px;
      }
    }
  }
`;
