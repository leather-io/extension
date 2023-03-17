import { parseIfValidPunycode } from '@app/common/utils';
import { useCurrentAccountNames } from '@app/query/stacks/bns/bns.hooks';
import { useNonFungibleTokensMetadata } from '@app/query/stacks/tokens/non-fungible-tokens/non-fungible-token-metadata.hooks';

import { StacksBnsName } from './stacks-bns-name';
import { StacksNonFungibleTokens } from './stacks-non-fungible-tokens';

export function StacksCryptoAssets() {
  const { data: names = [] } = useCurrentAccountNames();
  const stacksNftsMetadataResp = useNonFungibleTokensMetadata();

  return (
    <>
      {names.map(name => (
        <StacksBnsName bnsName={parseIfValidPunycode(name)} key={name} />
      ))}
      {stacksNftsMetadataResp.map(nft => {
        if (!nft || !nft.metadata) return null;
        return <StacksNonFungibleTokens key={nft.token_uri} metadata={nft.metadata} />;
      })}
    </>
  );
}
