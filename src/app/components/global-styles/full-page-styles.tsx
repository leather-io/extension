import { css } from '@emotion/react';

export const CENTERED_FULL_PAGE_MAX_WIDTH = '440px';
export const HOME_FULL_PAGE_MAX_WIDTH = '800px';

export const fullPageStyles = css`
  .mode__full-page {
    &,
    body {
      height: 100%;
      max-height: unset;
      width: 100%;
    }
    .main-content {
      flex-direction: row;
      flex-grow: 1;
      justify-content: center;
      margin: 0 auto;
    }
  }
`;
