import React from 'react';
import { AssetList } from '@components/popup/asset-list';
import { useFetchAccountData } from '@common/hooks/use-account-info';
import { Flex } from '@stacks/ui';
import { TxItem } from './tx-item';
import { MempoolTransaction, Transaction } from '@blockstack/stacks-blockchain-api-types';

export const AccountInfo: React.FC = () => {
  const { data } = useFetchAccountData();
  if (!data) {
    return null;
  }
  const latestConfirmedTx = data.transactions.results[0];
  const latestPendingTx = data.pendingTransactions[0];
  const latestTx: MempoolTransaction | Transaction = latestPendingTx || latestConfirmedTx;
  return (
    <Flex flexWrap="wrap" flexDirection="column">
      <TxItem transaction={latestTx} />
      <AssetList balances={data.balances} />
    </Flex>
  );
};
