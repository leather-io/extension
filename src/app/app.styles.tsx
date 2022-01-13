import { css } from '@emotion/react';

// TODO: These were relocated from global-styles
// Continue to investigate if these are needed
export const appStyles = css`
  body {
    display: flex;
    &.no-scroll {
      overflow: hidden;
      pointer-events: none;
    }
  }
  #app {
    display: flex;
    flex-grow: 1;
    min-height: 100vh;
  }
  .mode__full-page {
    &,
    body {
      height: 100%;
      max-height: unset;
      width: 100%;
    }
  }
  .mode__popup {
    &,
    body {
      min-height: 600px !important;
      min-width: 392px !important;
      overflow-x: hidden;
    }
  }
  .mode__popup-center {
    &,
    body {
      height: unset !important;
      min-height: 552px !important;
      min-width: 440px !important;
      overflow-x: hidden;
    }
  }
`;
