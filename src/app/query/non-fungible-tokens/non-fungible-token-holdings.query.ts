import { useQueries, useQuery } from 'react-query';

import { useCurrentNetwork } from '@app/common/hooks/use-current-network';
import { AccountWithAddress } from '@app/store/accounts/account.models';
import { Api, useApi } from '@app/store/common/api-clients.hooks';

const staleTime = 15 * 60 * 1000; // 15 min

const queryOptions = {
  cacheTime: staleTime,
  staleTime,
} as const;

function fetchNonFungibleTokenHoldings(api: Api) {
  return (address?: string) => async () => {
    if (!address) return;
    return api.nonFungibleTokensApi.getNftHoldings({ principal: address, limit: 50 });
  };
}

export function useGetNonFungibleTokenHoldingsQuery(address?: string) {
  const api = useApi();
  const network = useCurrentNetwork();

  return useQuery({
    queryKey: ['get-nft-holdings', address, network.url],
    queryFn: fetchNonFungibleTokenHoldings(api)(address),
    ...queryOptions,
  });
}

export function useGetNonFungibleTokenHoldingsListQuery(accounts?: AccountWithAddress[]) {
  const api = useApi();
  const network = useCurrentNetwork();

  return useQueries(
    (accounts || []).map(account => ({
      queryKey: ['get-nft-holdings', account.address, network.url],
      queryFn: fetchNonFungibleTokenHoldings(api)(account.address),
      ...queryOptions,
    }))
  );
}
