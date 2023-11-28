import React from 'react';

import { Box, styled } from 'leather-styles/jsx';

export const Bns = () => {
  return (
    <Box py={6}>
      <styled.h2>BNS</styled.h2>
      <styled.span>Use the testnet version of btc.us to QA BNS names.</styled.span>
      <styled.button onClick={() => window.open('https://btc-website.tintashlabs.com/')}>
        Open testnet btc.us
      </styled.button>
    </Box>
  );
};
