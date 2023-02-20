import { useNonFungibleTokensMetadata } from '@app/query/stacks/non-fungible-tokens/non-fungible-token-metadata.hooks';

import { StacksNonFungibleTokens } from './stacks-non-fungible-tokens';

// TODO: Setting this up here to receive other asset types (ex. bns names)
export function StacksCryptoAssets() {
  // const { data: stacksNftAssetBalances = [] } = useStacksNonFungibleTokenAssetsUnanchored();
  const stacksNftsMetadataResp = useNonFungibleTokensMetadata();

  return (
    <>
      {stacksNftsMetadataResp.map(nft =>
        nft ? <StacksNonFungibleTokens metadata={nft?.metadata} /> : null
      )}
    </>
  );
}
