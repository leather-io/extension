import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { AccountWithAddress } from '@app/store/accounts/account.models';

import { useGetNonFungibleTokenHoldingsListQuery } from './non-fungible-token-holdings.query';

export function useAccountsNonFungibleTokenHoldings(accounts?: AccountWithAddress[]) {
  const accountsNftHoldings = useGetNonFungibleTokenHoldingsListQuery(accounts);

  return useMemo(
    () =>
      accountsNftHoldings.reduce((acc, nftHoldings) => {
        return acc.plus(nftHoldings.data?.total || 0);
      }, new BigNumber(0)),
    [accountsNftHoldings]
  );
}
