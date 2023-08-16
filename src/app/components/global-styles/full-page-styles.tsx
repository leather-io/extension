import { css } from '@emotion/react';

export const fullPageStyles = css`
  .mode__full-page {
    &,
    body,
    .radix-themes {
      height: 100%;
      max-height: unset;
      width: 100%;
    }
    .main-content {
      flex-grow: 1;
      justify-content: center;
      margin: 0 auto;
    }
  }
`;
