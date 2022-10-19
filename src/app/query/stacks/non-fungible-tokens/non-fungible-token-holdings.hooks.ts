import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { AccountWithAddress } from '@app/store/accounts/account.models';

import {
  useGetNonFungibleTokenHoldingsListQuery,
  useGetNonFungibleTokenHoldingsQuery,
} from './non-fungible-token-holdings.query';

export function useNonFungibleTokenHoldings(address?: string) {
  const { data: nftHoldings } = useGetNonFungibleTokenHoldingsQuery(address);
  return nftHoldings;
}

export function useAccountsNonFungibleTokenHoldings(accounts?: AccountWithAddress[]) {
  const accountsNftHoldings = useGetNonFungibleTokenHoldingsListQuery(accounts);

  return useMemo(() => {
    return accountsNftHoldings.reduce((acc, nftHoldings) => {
      return acc.plus(nftHoldings.data?.total || 0);
    }, new BigNumber(0));
  }, [accountsNftHoldings]);
}
