import { hexToCV } from '@stacks/transactions';
import { useQueries } from '@tanstack/react-query';

import { StacksNftMetadataResponse } from '@shared/models/stacks-nft-metadata.model';

import { fetcher } from '@app/common/api/wrapped-fetch';
import { pullContractIdFromIdentity } from '@app/common/utils';
import { QueryPrefixes } from '@app/query/query-prefixes';

import { RateLimiter, useHiroApiRateLimiter } from '../rate-limiter';
import { useAccountNonFungibleTokenHoldings } from './non-fungible-token-holdings.hooks';

const queryOptions = {
  refetchOnWindowFocus: true,
  refetchOnMount: false,
  staleTime: 10 * 1000,
};

function getTokenId(hex: string) {
  const clarityValue = hexToCV(hex);
  return clarityValue.type === 1 ? Number(clarityValue.value) : 0;
}

function fetchNonFungibleTokenMetadata(limiter: RateLimiter) {
  return async (principal: string, tokenId?: number) => {
    await limiter.removeTokens(1);
    const resp = await fetcher(`https://api.hiro.so/metadata/v1/nft/${principal}/${tokenId}`);
    const data = await resp.json();
    return data as Promise<StacksNftMetadataResponse>;
  };
}

export function useGetNonFungibleTokenMetadataListQuery() {
  const nftHoldings = useAccountNonFungibleTokenHoldings();
  const limiter = useHiroApiRateLimiter();

  return useQueries({
    queries: nftHoldings.map(nft => {
      const principal = pullContractIdFromIdentity(nft.asset_identifier);
      const tokenId = getTokenId(nft.value.hex);

      return {
        enabled: !!tokenId,
        queryKey: [QueryPrefixes.GetNftMetadata, principal, tokenId],
        queryFn: () => fetchNonFungibleTokenMetadata(limiter)(principal, tokenId),
        ...queryOptions,
      };
    }),
  });
}
