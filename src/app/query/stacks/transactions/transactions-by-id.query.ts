import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types/generated';
import { useStacksClient } from '@app/store/common/api-clients.hooks';
import { useQueries, useQuery } from 'react-query';

export function useTransactionsById(txids: string[]) {
  const client = useStacksClient();

  function transactionByIdFetcher(txId: string) {
    return client.transactionsApi.getTransactionById({ txId }) as unknown as MempoolTransaction;
  }

  return useQueries(
    txids.map(txid => {
      return {
        queryKey: ['transaction-by-id', txid],
        queryFn: () => transactionByIdFetcher(txid),
      };
    })
  );
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
