import { useEffect } from 'react';

import { isNftAsset, useGetBnsNamesOwnedByAddressQuery } from '@leather.io/query';

import { analytics } from '@shared/utils/analytics';

import { parseIfValidPunycode } from '@app/common/utils';
import { useStacksNonFungibleTokensMetadata } from '@app/query/stacks/stacks-nft-token-metadata.query';

import { StacksBnsName } from './stacks-bns-name';
import { StacksNonFungibleTokens } from './stacks-non-fungible-tokens';

interface StacksCryptoAssetsProps {
  address: string;
}
export function StacksCryptoAssets({ address }: StacksCryptoAssetsProps) {
  const names = useGetBnsNamesOwnedByAddressQuery(address).data?.names;

  // NftMetadataResponse[]
  const stacksNftsMetadataResp = useStacksNonFungibleTokensMetadata(address)
    .filter(resp => resp.status === 'success')
    .map(resp => {
      if (resp.data && isNftAsset(resp.data)) return resp.data;
      return;
    });

  useEffect(() => {
    if (stacksNftsMetadataResp.length > 0) {
      void analytics.track('view_collectibles', {
        stacks_nfts_count: stacksNftsMetadataResp.length,
      });
      void analytics.identify({ stacks_nfts_count: stacksNftsMetadataResp.length });
    }
  }, [stacksNftsMetadataResp.length]);

  return (
    <>
      {(names ?? []).map(name => (
        <StacksBnsName bnsName={parseIfValidPunycode(name)} key={name} />
      ))}
      {stacksNftsMetadataResp.map((nft, i) => {
        if (!nft || !nft.metadata) return null;
        return <StacksNonFungibleTokens key={i} metadata={nft.metadata} />;
      })}
    </>
  );
}
