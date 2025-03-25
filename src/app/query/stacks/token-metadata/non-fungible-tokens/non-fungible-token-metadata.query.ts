import { hexToCV } from '@stacks/transactions';
import { type UseQueryResult, useQueries } from '@tanstack/react-query';

import {
  type NftAssetResponse,
  createGetNonFungibleTokenMetadataQueryOptions,
} from '@leather.io/query';
import { getPrincipalFromAssetString } from '@leather.io/stacks';

import { useStacksClient } from '../../stacks-client';
import { useGetNonFungibleTokenHoldingsQuery } from './non-fungible-token-holdings.query';

function getTokenId(hex: string) {
  const clarityValue = hexToCV(hex);
  return clarityValue.type === 'uint' ? Number(clarityValue.value) : 0;
}

export function useGetNonFungibleTokenMetadataListQuery(
  address: string
): UseQueryResult<NftAssetResponse>[] {
  const client = useStacksClient();
  const nftHoldings = useGetNonFungibleTokenHoldingsQuery(address);

  return useQueries({
    queries: (nftHoldings.data?.results ?? []).map(nft => {
      const address = getPrincipalFromAssetString(nft.asset_identifier);
      const tokenId = getTokenId(nft.value.hex);

      return {
        ...createGetNonFungibleTokenMetadataQueryOptions({
          address,
          client,
          tokenId,
        }),
      };
    }),
  });
}
