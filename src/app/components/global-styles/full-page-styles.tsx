import { css } from '@emotion/react';

export const DESKTOP_VIEWPORT_MIN_WIDTH = '480px';
export const CENTERED_FULL_PAGE_MAX_WIDTH = '440px';
export const HOME_FULL_PAGE_MAX_WIDTH = '832px';
export const ONBOARDING_PAGE_MAX_WIDTH = '1208px';

export const fullPageStyles = css`
  .mode__full-page {
    &,
    body {
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
