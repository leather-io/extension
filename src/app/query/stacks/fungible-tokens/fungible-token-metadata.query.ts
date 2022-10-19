import { useQueries, useQuery } from '@tanstack/react-query';
import { RateLimiter } from 'limiter';

import { isResponseCode } from '@app/common/network/is-response-code';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { useStacksClient } from '@app/store/common/api-clients.hooks';
import { StacksClient } from '@app/query/stacks/stacks-client';

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 250 });

const staleTime = 12 * 60 * 60 * 1000;

const queryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  staleTime: staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
  retry: 2,
  retryDelay: 2 * 60 * 1000,
} as const;

const is404 = isResponseCode(404);

function fetchUnanchoredAccountInfo(client: StacksClient) {
  return (contractId: string) => async () => {
    await limiter.removeTokens(1);
    return client.fungibleTokensApi
      .getContractFtMetadata({ contractId })
      .catch(error => (is404(error) ? null : error));
  };
}

export function useGetFungibleTokenMetadataQuery(contractId: string) {
  const client = useStacksClient();
  const network = useCurrentNetworkState();

  return useQuery({
    queryKey: ['get-ft-metadata', contractId, network.url],
    queryFn: fetchUnanchoredAccountInfo(client)(contractId),
    ...queryOptions,
  });
}

export function useGetFungibleTokenMetadataListQuery(contractIds: string[]) {
  const client = useStacksClient();
  const network = useCurrentNetworkState();

  return useQueries({
    queries: contractIds.map(contractId => ({
      queryKey: ['get-ft-metadata', contractId, network.url],
      queryFn: fetchUnanchoredAccountInfo(client)(contractId),
      ...queryOptions,
    })),
  });
}
