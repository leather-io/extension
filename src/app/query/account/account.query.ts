import { useQuery } from 'react-query';
import { AccountDataResponse } from '@stacks/stacks-blockchain-api-types';

import { useApi, Api } from '@app/store/common/api-clients.hooks';
import { useSetAccountInfo } from '@app/store/accounts/account.hooks';

const staleTime = 5 * 60 * 1000;

const accountQueryOptions = {
  keepPreviousData: true,
  cacheTime: staleTime,
  refetchOnMount: true,
  refetchInterval: false,
  refetchOnReconnect: true,
} as const;

function fetchUnanchoredAccountInfo(api: Api) {
  return (principal: string) => () =>
    api.accountsApi.getAccountInfo({ principal, proof: 0 }) as Promise<AccountDataResponse>;
}

export function useGetAccountInfoQuery(address: string) {
  const api = useApi();
  const setDeprecatedAtom = useSetAccountInfo();
  return useQuery({
    queryKey: ['get-account-info', address],
    queryFn: fetchUnanchoredAccountInfo(api)(address),
    onSuccess: resp => setDeprecatedAtom(resp),
    ...accountQueryOptions,
  });
}
