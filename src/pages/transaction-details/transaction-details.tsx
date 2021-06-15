import React from 'react';

import { PopupContainer } from '@components/popup/container';
import { useParseTxid } from './hooks/use-is-valid-txid';
import { Header } from '@components/header';

export function TransactionDetails() {
  const { txid, isValidTxid } = useParseTxid();
  if (!isValidTxid) return <>{txid} is not a valid txid</>;
  return (
    <PopupContainer header={<Header />}>
      <>{txid} is valid</>;
    </PopupContainer>
  );
}
