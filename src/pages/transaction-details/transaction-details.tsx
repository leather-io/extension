import React from 'react';
import { Box, Stack } from '@stacks/ui';

import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';

import { useParseTxid } from './hooks/use-is-valid-txid';
import { TxStatusLabel } from './components/tx-status-label';

export function TransactionDetails() {
  const { txid, isValidTxid } = useParseTxid();
  if (!isValidTxid) return <>{txid} is not a valid txid</>;
  return (
    <PopupContainer header={<Header />}>
      <Box maxWidth="392px">
        <>{txid} is valid</>
        <Stack isInline mt="base">
          <TxStatusLabel status="confirmed" />
          <TxStatusLabel status="pending" />
          <TxStatusLabel status="failed" />
        </Stack>
      </Box>
    </PopupContainer>
  );
}
