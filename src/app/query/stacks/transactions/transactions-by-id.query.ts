import { useQueries, useQuery } from '@tanstack/react-query';

import { createGetTransactionByIdQueryOptions } from '@leather.io/query';

import { useStacksClient } from '../stacks-client';

export function useGetTransactionByIdQuery(txid: string) {
  const client = useStacksClient();
  return useQuery(createGetTransactionByIdQueryOptions({ client, txid }));
}

export function useGetTransactionByIdListQuery(txids: string[]) {
  const client = useStacksClient();

  return useQueries({
    queries: txids.map(txid => {
      return {
        ...createGetTransactionByIdQueryOptions({ client, txid }),
      };
    }),
  });
}
