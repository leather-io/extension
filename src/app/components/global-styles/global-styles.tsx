import { memo } from 'react';
import { Global, css } from '@emotion/react';
import { CSSReset } from '@stacks/ui';

import { fullPageStyles } from './full-page-styles';
import { popupStyles } from './popup-styles';
import { popupCenterStyles } from './popup-center-styles';

const styles = css`
  body {
    &.no-scroll .main-content {
      overflow: hidden;
      pointer-events: none;
    }
  }
  ${fullPageStyles};
  ${popupStyles};
  ${popupCenterStyles};
`;

export const GlobalStyles = memo(() => {
  return (
    <>
      {CSSReset}
      <Global styles={styles} />
    </>
  );
});
