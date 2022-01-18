import { useGetAccountInfoQuery } from './account.query';

export function useAccountInfo(address: string) {
  const { data: accountInfo } = useGetAccountInfoQuery(address);
  return accountInfo;
}
