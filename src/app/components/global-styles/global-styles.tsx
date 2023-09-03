import { memo } from 'react';

import { Global, css } from '@emotion/react';
import { radixBaseCSS } from '@radix-ui/themes/styles.css';
import { CSSReset } from '@stacks/ui';
import { token } from 'leather-styles/tokens';

import { fullPageStyles } from './full-page-styles';
import { popupCenterStyles } from './popup-center-styles';
import { popupStyles } from './popup-styles';
import { radixStyles } from './radix-styles';
import { tippyStyles } from './tippy-styles';

export const GlobalStyles = memo(() => {
  // use important here to override stacks ui styles
  const styles = css`
    html,
    body {
      background-color: ${token('colors.brown.1')}!important;
    }
    @media (min-width: 600px) {
      html,
      body {
        background-color: ${token('colors.brown.2')}!important;
      }
    }
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
    ${radixBaseCSS}
    ${radixStyles}
  `;

  return (
    <>
      {CSSReset}
      <Global styles={styles} />
    </>
  );
});
