import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types/generated';
import { useApi } from '@app/store/common/api-clients.hooks';
import { useQueries, useQuery } from 'react-query';

export function useTransactionsById(txids: string[]) {
  const api = useApi();

  function transactionByIdFetcher(txId: string) {
    return api.transactionsApi.getTransactionById({ txId }) as unknown as MempoolTransaction;
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
  const api = useApi();

  function transactionByIdFetcher(txId: string) {
    return api.transactionsApi.getTransactionById({ txId }) as unknown as
      | Transaction
      | MempoolTransaction;
  }

  return useQuery({
    queryKey: ['transaction-by-id', txid],
    queryFn: () => transactionByIdFetcher(txid),
  });
}
