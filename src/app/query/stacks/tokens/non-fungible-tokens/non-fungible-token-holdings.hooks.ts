import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import { useGetNonFungibleTokenHoldingsListQuery } from './non-fungible-token-holdings.query';

export function useAllAccountsNonFungibleTokenHoldingsTotal(accounts: StacksAccount[]) {
  const accountsNftHoldings = useGetNonFungibleTokenHoldingsListQuery(
    accounts.map(account => account.address)
  );

  return useMemo(
    () =>
      accountsNftHoldings.reduce(
        (acc, nftHoldings) => acc.plus(nftHoldings.data?.total || 0),
        new BigNumber(0)
      ),
    [accountsNftHoldings]
  );
}
