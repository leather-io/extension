import { useEffect } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { parseIfValidPunycode } from '@app/common/utils';
import { useCurrentAccountNames } from '@app/query/stacks/bns/bns.hooks';
import { useStacksNonFungibleTokensMetadata } from '@app/query/stacks/tokens/non-fungible-tokens/non-fungible-token-metadata.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

import { StacksBnsName } from './stacks-bns-name';
import { StacksNonFungibleTokens } from './stacks-non-fungible-tokens';

interface StacksCryptoAssetsProps {
  account: StacksAccount;
}
export function StacksCryptoAssets({ account }: StacksCryptoAssetsProps) {
  const { data: names = [] } = useCurrentAccountNames();
  const stacksNftsMetadataResp = useStacksNonFungibleTokensMetadata(account);
  const analytics = useAnalytics();

  useEffect(() => {
    if (stacksNftsMetadataResp.length > 0) {
      void analytics.track('view_collectibles', {
        stacks_nfts_count: stacksNftsMetadataResp.length,
      });
      void analytics.identify({ stacks_nfts_count: stacksNftsMetadataResp.length });
    }
  }, [stacksNftsMetadataResp.length, analytics]);

  return (
    <>
      {names.map(name => (
        <StacksBnsName bnsName={parseIfValidPunycode(name)} key={name} />
      ))}
      {stacksNftsMetadataResp.map((nft, i) => {
        if (!nft || !nft.metadata) return null;
        return <StacksNonFungibleTokens key={i} metadata={nft.metadata} />;
      })}
    </>
  );
}
