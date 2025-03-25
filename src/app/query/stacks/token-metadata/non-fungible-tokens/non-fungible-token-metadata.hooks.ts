import { useMemo } from 'react';

import { isNftAsset } from '@leather.io/query';

import { useGetNonFungibleTokenMetadataListQuery } from './non-fungible-token-metadata.query';

export function useStacksNonFungibleTokensMetadata(address: string) {
  const respList = useGetNonFungibleTokenMetadataListQuery(address);

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
