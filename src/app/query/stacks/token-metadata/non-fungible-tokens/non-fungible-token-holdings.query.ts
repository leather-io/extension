import { useQuery } from '@tanstack/react-query';

import { createGetNonFungibleTokenHoldingsQueryOptions } from '@leather.io/query';

import { useCurrentNetworkState } from '@app/query/leather-query-provider';

import { useStacksClient } from '../../stacks-client';

export function useGetNonFungibleTokenHoldingsQuery(address: string) {
  const client = useStacksClient();
  const network = useCurrentNetworkState();

  return useQuery(
    createGetNonFungibleTokenHoldingsQueryOptions({
      address,
      client,
      network: network.chain.stacks.url,
    })
  );
}
