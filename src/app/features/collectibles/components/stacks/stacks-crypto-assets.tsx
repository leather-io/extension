import { useEffect } from 'react';

import {
  useGetBnsNamesOwnedByAddressQuery,
  useStacksNonFungibleTokensMetadata,
} from '@leather.io/query';

import { analytics } from '@shared/utils/analytics';

import { parseIfValidPunycode } from '@app/common/utils';

import { StacksBnsName } from './stacks-bns-name';
import { StacksNonFungibleTokens } from './stacks-non-fungible-tokens';

interface StacksCryptoAssetsProps {
  address: string;
}
export function StacksCryptoAssets({ address }: StacksCryptoAssetsProps) {
  const bnsNames = useGetBnsNamesOwnedByAddressQuery(address).data?.names;

  const stacksNftsMetadataResp = useStacksNonFungibleTokensMetadata(address);

  useEffect(() => {
    if (stacksNftsMetadataResp.length > 0) {
      void analytics.track('view_collectibles', {
        stacks_nfts_count: stacksNftsMetadataResp.length,
      });
      void analytics.client.identify({ stacks_nfts_count: stacksNftsMetadataResp.length });
    }
  }, [stacksNftsMetadataResp.length]);

  function hideBnsCollectible(name: string) {
    return bnsNames?.includes(name) || name === 'BNS - Archive';
  }

  return (
    <>
      {(bnsNames ?? []).map(name => (
        <StacksBnsName bnsName={parseIfValidPunycode(name)} key={name} />
      ))}

      {stacksNftsMetadataResp.map((nft, i) => {
        if (!nft || !nft.metadata) return null;

        if (hideBnsCollectible(nft.metadata?.name ?? '')) {
          return null;
        }

        return <StacksNonFungibleTokens key={i} metadata={nft.metadata} />;
      })}
    </>
  );
}
