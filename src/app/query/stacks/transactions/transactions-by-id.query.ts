import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types/generated';
import { useQueries, useQuery } from '@tanstack/react-query';

import { useStacksClient } from '@app/store/common/api-clients.hooks';

export function useTransactionsById(txids: string[]) {
  const client = useStacksClient();

  function transactionByIdFetcher(txId: string) {
    return client.transactionsApi.getTransactionById({ txId }) as unknown as MempoolTransaction;
  }

  return useQueries({
    queries: txids.map(txid => {
      return {
        queryKey: ['transaction-by-id', txid],
        queryFn: () => transactionByIdFetcher(txid),
      };
    }),
  });
}

export function useTransactionById(txid: string) {
  const client = useStacksClient();

  function transactionByIdFetcher(txId: string) {
    return client.transactionsApi.getTransactionById({ txId }) as unknown as
      | Transaction
      | MempoolTransaction;
  }

  return useQuery({
    queryKey: ['transaction-by-id', txid],
    queryFn: () => transactionByIdFetcher(txid),
  });
}
