import { useMemo } from 'react';
import { useQueries, useQuery } from 'react-query';

import { useApi, Api } from '@app/store/common/api-clients.hooks';

import { useCurrentNetwork } from '@app/common/hooks/use-current-network';
import { useAssets } from '@app/store/assets/asset.hooks';
import { formatContractId } from '@app/common/utils';

const STALE_TIME = 10 * 60 * 1000;

const queryOptions = {
  keepPreviousData: true,
  cacheTime: STALE_TIME,
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

function useGetFungibleTokenMetadataListQuery(contractIds: string[]) {
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

export function useAssetsWithMetadata() {
  const assets = useAssets();
  const assetMetadata = useGetFungibleTokenMetadataListQuery(
    assets.map(a => formatContractId(a.contractAddress, a.contractName))
  );
  return useMemo(
    () => assets.map((asset, i) => ({ ...asset, canTransfer: true, meta: assetMetadata[i].data })),
    // We don't want to reevaluate on assetMetadata reference change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assets]
  );
}
