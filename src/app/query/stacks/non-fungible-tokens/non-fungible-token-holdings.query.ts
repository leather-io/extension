import { useQueries, useQuery } from '@tanstack/react-query';

import { StacksClient } from '@app/query/stacks/stacks-client';
import { AccountWithAddress } from '@app/store/accounts/account.models';
import { useStacksClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

const staleTime = 15 * 60 * 1000; // 15 min

const queryOptions = {
  cacheTime: staleTime,
  staleTime,
} as const;

function fetchNonFungibleTokenHoldings(client: StacksClient) {
  return (address?: string) => async () => {
    if (!address) return;
    return client.nonFungibleTokensApi.getNftHoldings({ principal: address, limit: 50 });
  };
}

export function useGetNonFungibleTokenHoldingsQuery(address?: string) {
  const client = useStacksClient();
  const network = useCurrentNetworkState();

  return useQuery({
    queryKey: ['get-nft-holdings', address, network.url],
    queryFn: fetchNonFungibleTokenHoldings(client)(address),
    ...queryOptions,
  });
}

export function useGetNonFungibleTokenHoldingsListQuery(accounts?: AccountWithAddress[]) {
  const client = useStacksClient();
  const network = useCurrentNetworkState();

  return useQueries({
    queries: (accounts || []).map(account => ({
      queryKey: ['get-nft-holdings', account.address, network.url],
      queryFn: fetchNonFungibleTokenHoldings(client)(account.address),
      ...queryOptions,
    })),
  });
}
