import { useMemo } from 'react';

import { isNftAsset } from '../token-metadata.utils';
import { useGetNonFungibleTokenMetadataListQuery } from './non-fungible-token-metadata.query';

export function useNonFungibleTokensMetadata() {
  const respList = useGetNonFungibleTokenMetadataListQuery();

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
