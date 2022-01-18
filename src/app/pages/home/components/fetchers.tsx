import { useAccountInfo } from '@app/query/account/account.hooks';
import { useAddressBalances } from '@app/query/balance/balance.hooks';

// These components are intended to be temporary. They exist only to coerce the
// app to fetch data and set it into existing atoms. This code should be
// removed, when all external data is accssed by via hooks, and not the implicit
// atom tree.

interface BalanceFetcherProps {
  address: string;
}
export function BalanceFetcher({ address }: BalanceFetcherProps) {
  useAddressBalances(address);
  return null;
}

interface AccountInfoFetcherProps {
  address: string;
}
export function AccountInfoFetcher({ address }: AccountInfoFetcherProps) {
  useAccountInfo(address);
  return null;
}
