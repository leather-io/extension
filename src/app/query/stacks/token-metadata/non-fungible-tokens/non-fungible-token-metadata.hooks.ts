import { useMemo } from 'react';

import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import { isNftAsset } from '../token-metadata.utils';
import { useGetNonFungibleTokenMetadataListQuery } from './non-fungible-token-metadata.query';

export function useStacksNonFungibleTokensMetadata(account: StacksAccount) {
  const respList = useGetNonFungibleTokenMetadataListQuery(account);

  return useMemo(
    () =>
      respList
        .filter(resp => resp.status === 'success')
        .map(resp => {
          if (resp.data && isNftAsset(resp.data)) return resp.data;
          return;
        }),
    [respList]
  );
}
