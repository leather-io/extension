import { css } from '@emotion/css';

import { POPUP_WIDTH } from '@shared/styles-constants';

export const fullPageContainer = css`
  flex-direction: row;
  justify-content: center;
  margin: 0 auto;
`;

export const popupContainer = css`
  flex-direction: column;
  max-width: 392px;
`;

export const popupCenterContainer = css`
  flex-direction: column;
  max-width: ${POPUP_WIDTH}px;
`;
