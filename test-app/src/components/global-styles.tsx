import React, { memo } from 'react';

import { Global, css } from '@emotion/react';
import { CSSReset } from '@stacks/ui';

const SizeStyles = css`
  body {
    display: flex;
    width: 100%;
  }
  #app-root {
    flex-grow: 1;
    display: flex;
    min-height: 100vh;
  }
  video {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    object-fit: cover;
    z-index: 0;
  }
`;

export const GlobalStyles = memo(() => {
  return (
    <>
      {CSSReset}
      <Global styles={SizeStyles} />
    </>
  );
});
