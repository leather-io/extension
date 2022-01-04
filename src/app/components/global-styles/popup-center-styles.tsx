import { css } from '@emotion/react';

import { POPUP_WIDTH } from '@shared/constants';

export const popupCenterStyles = css`
  .mode__popup-center {
    &,
    body {
      height: unset !important;
      min-height: 552px !important;
      min-width: 440px !important;
      overflow-x: hidden;
      main.main-content {
        flex-grow: 1;
        max-width: ${POPUP_WIDTH}px;
      }
    }
  }
`;
