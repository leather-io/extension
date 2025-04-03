import { useQuery } from '@tanstack/react-query';

import { createGetAccountTransactionsWithTransfersQueryOptions } from '@leather.io/query';

import { useCurrentNetworkState } from '@app/query/leather-query-provider';

import { useStacksClient } from '../stacks-client';

export function useGetAccountTransactionsWithTransfersQuery(address: string) {
  const network = useCurrentNetworkState();
  const client = useStacksClient();

  return useQuery(
    createGetAccountTransactionsWithTransfersQueryOptions({
      address,
      client,
      network: network.chain.stacks.url,
    })
  );
}
