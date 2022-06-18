import { memo } from 'react';
import { Global, css } from '@emotion/react';
import { CSSReset } from '@stacks/ui';

import { fullPageStyles } from './full-page-styles';
import { popupStyles } from './popup-styles';
import { popupCenterStyles } from './popup-center-styles';
import { tippyStyles } from './tippy-styles';

const styles = css`
  body {
    &.no-scroll,
    &.no-scroll .main-content {
      overflow: hidden;
    }
  }
  ${fullPageStyles};
  ${popupStyles};
  ${popupCenterStyles};
  ${tippyStyles}
`;

export const GlobalStyles = memo(() => {
  return (
    <>
      {CSSReset}
      <Global styles={styles} />
    </>
  );
});
