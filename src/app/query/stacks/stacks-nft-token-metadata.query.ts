import { hexToCV } from '@stacks/transactions';
import { useQueries } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createGetNonFungibleTokenMetadataQueryOptions,
  useGetNonFungibleTokenHoldingsQuery,
  useStacksClient,
} from '@leather.io/query';

import { getPrincipalFromContractId } from '@app/common/utils';
import { useStacksNftMissingMetadata } from '@app/store/missing-stacks-nfts/missing-stacks-nfts.slice';

function getTokenId(hex: string) {
  const clarityValue = hexToCV(hex);
  return clarityValue.type === 1 ? Number(clarityValue.value) : 0;
}

function statusCodeNotFoundOrNotProcessable(status: number) {
  return status === 404 || status === 422;
}

export function useStacksNonFungibleTokensMetadata(address: string) {
  const nftHoldings = useGetNonFungibleTokenHoldingsQuery(address);
  const stacksClient = useStacksClient();

  const { addKnownMissingStacksNft, isMissingStacksNftMetadata } = useStacksNftMissingMetadata();

  return useQueries({
    queries: (nftHoldings.data?.results ?? []).map(nft => {
      const address = getPrincipalFromContractId(nft.asset_identifier);
      const tokenId = getTokenId(nft.value.hex);

      const identifier = address + tokenId;

      return {
        ...createGetNonFungibleTokenMetadataQueryOptions({
          address,
          client: stacksClient,
          tokenId,
        }),
        enabled: !isMissingStacksNftMetadata(identifier),
        retry(_count: number, error: AxiosError) {
          if (statusCodeNotFoundOrNotProcessable(error.request.status)) {
            addKnownMissingStacksNft(identifier);
            return false;
          }
          return true;
        },
      };
    }),
  });
}
