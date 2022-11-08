import { memo } from 'react';

import { Global, css } from '@emotion/react';
import { CSSReset } from '@stacks/ui';

import { useThemeSwitcher } from '@app/common/theme-provider';

import { fullPageStyles } from './full-page-styles';
import { popupCenterStyles } from './popup-center-styles';
import { popupStyles } from './popup-styles';
import { tippyStyles } from './tippy-styles';

export const GlobalStyles = memo(() => {
  const { theme } = useThemeSwitcher();

  const styles = css`
    :root {
      ${theme === 'dark' ? 'filter: invert(1) hue-rotate(180deg)' : ''};
      transition: filter 0.8s;
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
  `;

  return (
    <>
      {CSSReset}
      <Global styles={styles} />
    </>
  );
});
