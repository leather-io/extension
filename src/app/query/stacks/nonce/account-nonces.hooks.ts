import { useQuery } from '@tanstack/react-query';

import { createGetAccountNoncesQueryOptions, parseAccountNoncesResponse } from '@leather.io/query';

import { useCurrentNetworkState } from '@app/query/leather-query-provider';

import { useStacksPendingTransactions } from '../mempool/mempool.hooks';
import { useStacksClient } from '../stacks-client';
import { useStacksConfirmedTransactions } from '../transactions/transactions-with-transfers.hooks';

export function useNextNonce(address: string) {
  const client = useStacksClient();
  const network = useCurrentNetworkState();
  const confirmedTransactions = useStacksConfirmedTransactions(address);
  const { transactions: pendingTransactions } = useStacksPendingTransactions(address);

  return useQuery({
    ...createGetAccountNoncesQueryOptions({ address, client, network: network.chain.stacks.url }),
    staleTime: 0,
    select: resp =>
      parseAccountNoncesResponse({
        addressNonces: resp,
        confirmedTransactions,
        pendingTransactions,
        senderAddress: address,
      }),
  });
}
