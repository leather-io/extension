import { css } from '@emotion/css';

import { FULL_PAGE_MAX_WIDTH } from '@shared/styles-constants';

export const fullPageContent = css`
  height: 100%;
  justify-content: center;
  max-width: ${FULL_PAGE_MAX_WIDTH}px;
`;

export const fullPageOnboardingContent = css`
  align-items: center;
`;

export const fullPageText = css`
  padding: 0px 16px;
  text-align: center;
`;

export const popupPageContent = css`
  margin-top: 16px;
`;
