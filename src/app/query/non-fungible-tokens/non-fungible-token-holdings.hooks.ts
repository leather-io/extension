import BigNumber from 'bignumber.js';

import { SoftwareWalletAccountWithAddress } from '@app/store/accounts/account.models';

import {
  useGetNonFungibleTokenHoldingsListQuery,
  useGetNonFungibleTokenHoldingsQuery,
} from './non-fungible-token-holdings.query';

export function useNonFungibleTokenHoldings(address?: string) {
  const { data: nftHoldings } = useGetNonFungibleTokenHoldingsQuery(address);
  return nftHoldings;
}

export function useAccountsNonFungibleTokenHoldings(accounts?: SoftwareWalletAccountWithAddress[]) {
  const accountsNftHoldings = useGetNonFungibleTokenHoldingsListQuery(accounts);

  return accountsNftHoldings.reduce((acc, nftHoldings) => {
    return acc.plus(nftHoldings.data?.total || 0);
  }, new BigNumber(0));
}
