import { useMemo } from 'react';

import { useGetAccountTransactionsWithTransfersQuery } from './transactions-with-transfers.query';

export function useStacksConfirmedTransactions(address: string) {
  const txs = useGetAccountTransactionsWithTransfersQuery(address).data?.results;
  return useMemo(() => txs?.map(txWithTransfers => txWithTransfers.tx), [txs]) ?? [];
}
