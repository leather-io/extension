import { css } from '@emotion/css';

import { FULL_PAGE_MAX_WIDTH } from '@shared/constants';

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

export const fullPageTitle = css`
  font-size: 48px;
  line-height: 60px;
  text-align: center;
`;

export const fullPageOnboardingTitle = css`
  font-size: 64px;
`;

export const popupPageContent = css`
  margin-top: 16px;
`;

export const popupPageTitle = css`
  font-size: 32px;
  line-height: 44px;
`;
