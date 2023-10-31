import React from 'react';

import { Box, styled } from 'leather-styles/jsx';

import { CounterActions } from './counter-actions';
import { ExplorerLink } from './explorer-link';

export const Counter = () => {
  return (
    <Box py={6}>
      <styled.h2>Counter smart contract</styled.h2>
      <styled.span>
        Try a smart contract that keeps a single "counter" state variable. The public methods
        "increment" and "decrement" change the value of the counter.
      </styled.span>
      <ExplorerLink
        txId="STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.counter"
        text="View contract in explorer"
        skipConfirmCheck
      />
      <CounterActions />
    </Box>
  );
};
