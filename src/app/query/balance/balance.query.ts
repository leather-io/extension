import { useQuery } from 'react-query';

import { useApi, Api } from '@app/store/common/api-clients.hooks';

const STALE_TIME = 15 * 60 * 1000; // 15 min

const balanceQueryOptions = {
  keepPreviousData: false,
  cacheTime: STALE_TIME,
  refetchOnMount: false,
  refetchInterval: false,
  refetchOnReconnect: false,
} as const;

function fetchAccountAnchoredBalance(api: Api) {
  return (principal: string) => () => api.accountsApi.getAccountBalance({ principal });
}

export function useGetAccountBalanceQuery(address: string) {
  const api = useApi();
  return useQuery({
    queryKey: ['get-address-stx-balance', address],
    queryFn: fetchAccountAnchoredBalance(api)(address),
    ...balanceQueryOptions,
    suspense: true,
  });
}
