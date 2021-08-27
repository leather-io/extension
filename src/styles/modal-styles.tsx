import { css } from '@emotion/react';

export const modalStyles = css`
  .mode__modal {
    &,
    body {
      height: unset !important;
      min-height: 646px !important;
      min-width: 442px !important;
      overflow-x: hidden;
    }

    main.main-content {
      flex-grow: 1;
      max-width: 442px;
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
