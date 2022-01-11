import { memo } from 'react';
import { Global, css } from '@emotion/react';
import { CSSReset } from '@stacks/ui';

import { extensionStyles } from './popup-styles';
import { fullPageStyles } from './full-page-styles';
import { popupCenterStyles } from './popup-center-styles';

const styles = css`
  body {
    display: flex;
    &.no-scroll .main-content {
      overflow: hidden;
      pointer-events: none;
    }
  }
  #app {
    display: flex;
    flex-grow: 1;
    min-height: 100vh;
  }
  ${extensionStyles};
  ${fullPageStyles};
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
