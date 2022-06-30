import { useQueries, useQuery } from 'react-query';
import { RateLimiter } from 'limiter';

import { useApi, Api } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/common/hooks/use-current-network';
import { isResponseCode } from '@app/common/network/is-response-code';

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 250 });

const staleTime = 6 * 60 * 60 * 1000;

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

function fetchUnanchoredAccountInfo(api: Api) {
  return (contractId: string) => async () => {
    await limiter.removeTokens(1);
    return api.fungibleTokensApi
      .getContractFtMetadata({ contractId })
      .catch(error => (is404(error) ? undefined : error));
  };
}

export function useGetFungibleTokenMetadataQuery(contractId: string) {
  const api = useApi();
  const network = useCurrentNetwork();
  return useQuery({
    queryKey: ['get-ft-metadata', contractId, network.url],
    queryFn: fetchUnanchoredAccountInfo(api)(contractId),
    ...queryOptions,
  });
}

export function useGetFungibleTokenMetadataListQuery(contractIds: string[]) {
  const api = useApi();
  const network = useCurrentNetwork();
  return useQueries(
    contractIds.map(contractId => ({
      queryKey: ['get-ft-metadata', contractId, network.url],
      queryFn: fetchUnanchoredAccountInfo(api)(contractId),
      ...queryOptions,
    }))
  );
}
