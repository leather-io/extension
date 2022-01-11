import { css } from '@emotion/css';

import { FULL_PAGE_MAX_WIDTH } from '@shared/constants';

export const fullPageContent = css`
  align-items: center;
  height: 100%;
  justify-content: center;
  max-width: ${FULL_PAGE_MAX_WIDTH}px;
  padding: 0px 24px;
`;

export const fullPageTitle = css`
  font-size: 48px;
  line-height: 60px;
  text-align: center;
`;

export const popupTitle = css`
  font-size: 32px;
  line-height: 44px;
  margin-bottom: 16px !important;
  width: 264px;
`;
