import React from 'react';
import { Box, Stack } from '@stacks/ui';

import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';

import { useParseTxid } from './hooks/use-is-valid-txid';
import { TxStatusLabel } from './components/tx-status-label';
import {
  TxInfoList as List,
  TxInfoListLabel as Label,
  TxInfoListRow as Row,
  TxInfoListValue as Value,
} from './components/tx-info-list';

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
        <List minWidth="280px" mt="base">
          <Row>
            <Label>Amount</Label>
            <Value>100 STX</Value>
          </Row>
          <Row>
            <Label>From</Label>
            <Value>x</Value>
          </Row>
          <Row>
            <Label>To</Label>
            <Value>y</Value>
          </Row>
          <Row>
            <Label>ID</Label>
            <Value>z</Value>
          </Row>
          <Row>
            <Label>Fees</Label>
            <Value>0.000012 STX</Value>
          </Row>
          <Row>
            <Label>Last updated</Label>
            <Value>3 mins ago</Value>
          </Row>
        </List>
      </Box>
    </PopupContainer>
  );
}
