import { useQueries, useQuery } from 'react-query';

import { useApi, Api } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/common/hooks/use-current-network';

const staleTime = 10 * 60 * 1000;

const queryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
  retryDelay: 120_000,
} as const;

function fetchUnanchoredAccountInfo(api: Api) {
  return (contractId: string) => () => api.tokensApi.getContractFtMetadata({ contractId });
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
