import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import { useGetNonFungibleTokenHoldingsListQuery } from './non-fungible-token-holdings.query';

export function useAccountsNonFungibleTokenHoldings(accounts?: StacksAccount[]) {
  const accountsNftHoldings = useGetNonFungibleTokenHoldingsListQuery(accounts);

  return useMemo(
    () =>
      accountsNftHoldings.reduce((acc, nftHoldings) => {
        return acc.plus(nftHoldings.data?.total || 0);
      }, new BigNumber(0)),
    [accountsNftHoldings]
  );
}
