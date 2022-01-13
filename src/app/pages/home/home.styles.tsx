import { css } from '@emotion/css';

import { POPUP_CENTER_WIDTH } from '@shared/constants';

export const onboardingStepItemStyles = css`
  @media (max-width: ${POPUP_CENTER_WIDTH}px) {
    &:nth-child(2) {
      height: 144px;
    }
  }
`;
