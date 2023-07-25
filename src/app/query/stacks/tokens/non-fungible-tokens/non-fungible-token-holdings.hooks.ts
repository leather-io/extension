import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import {
  useGetNonFungibleTokenHoldingsListQuery,
  useGetNonFungibleTokenHoldingsQuery,
} from './non-fungible-token-holdings.query';

export function useAllAccountsNonFungibleTokenHoldingsTotal(accounts?: StacksAccount[]) {
  const accountsNftHoldings = useGetNonFungibleTokenHoldingsListQuery(accounts);

  return useMemo(
    () =>
      accountsNftHoldings.reduce((acc, nftHoldings) => {
        return acc.plus(nftHoldings.data?.total || 0);
      }, new BigNumber(0)),
    [accountsNftHoldings]
  );
}

interface NonFungibleTokenHoldingListResult {
  asset_identifier: string;
  value: {
    hex: string;
    repr: string;
  };
  block_height: number;
  tx_id: string;
}

// export function useAccountNonFungibleTokenHoldings() {
//   const currentAccount = useCurrentStacksAccount();

//   const { data: nonFungibleTokenHoldings } = useGetNonFungibleTokenHoldingsQuery(
//     currentAccount?.address
//   );

//   return (nonFungibleTokenHoldings?.results as NonFungibleTokenHoldingListResult[]) ?? [];
// }
