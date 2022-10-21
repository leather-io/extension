import { useMemo } from 'react';

import { useGetAccountTransactionsWithTransfersQuery } from './transactions-with-transfers.query';

export function useStacksConfirmedTransactions() {
  const txs = useGetAccountTransactionsWithTransfersQuery().data?.results;
  return useMemo(() => txs?.map(txWithTransfers => txWithTransfers.tx), [txs]) ?? [];
}
