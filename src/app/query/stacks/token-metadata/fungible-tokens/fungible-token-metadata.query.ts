import { useQuery } from '@tanstack/react-query';

import { createGetFungibleTokenMetadataQueryOptions } from '@leather.io/query';

import { useCurrentNetworkState } from '@app/query/leather-query-provider';

import { useStacksClient } from '../../stacks-client';

export function useGetFungibleTokenMetadataQuery(address: string) {
  const client = useStacksClient();
  const network = useCurrentNetworkState();

  return useQuery(
    createGetFungibleTokenMetadataQueryOptions({
      address,
      client,
      network: network.chain.stacks.url,
    })
  );
}
