import { css } from '@emotion/react';

export const popupStyles = css`
  .mode__popup {
    &,
    body {
      min-height: 646px !important;
      min-width: 392px !important;
      overflow-x: hidden;

      main.main-content {
        flex-grow: 1;
        max-width: 392px;
      }
    }

    .installed-page {
      .content-image .image-large {
        display: none;
      }

      .content-text {
        .title {
          width: 264px;
          font-size: 32px;
          line-height: 44px;
          margin-top: 24px;
        }

        .text {
          margin-bottom: 16px;
        }
      }
    }
  }
`;
