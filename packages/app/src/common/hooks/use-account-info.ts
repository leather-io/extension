import { fetchAllAccountData, AllAccountData, fetchBalances } from '@common/api/accounts';
import { useWallet } from '@common/hooks/use-wallet';
import useSWR from 'swr';

export const useFetchAccountData = (principal: string) => {
  const { currentNetwork } = useWallet();
  const apiServer = currentNetwork.url;

  const fetcher = (apiServer: string, principal: string): Promise<AllAccountData> =>
    fetchAllAccountData(apiServer)(principal);

  const data = useSWR<AllAccountData>([apiServer, principal, 'all-account-data'], fetcher, {
    refreshInterval: 15000,
    suspense: true,
  });

  return data;
};

export const useFetchBalances = (suspense?: boolean) => {
  const { currentNetwork, currentIdentity } = useWallet();
  const apiServer = currentNetwork.url;
  const principal = currentIdentity.getStxAddress();

  const fetcher = (apiServer: string, principal: string) => fetchBalances(apiServer)(principal);

  const data = useSWR([apiServer, principal, 'balances'], fetcher, {
    refreshInterval: 15000,
    suspense,
  });

  return data;
};
