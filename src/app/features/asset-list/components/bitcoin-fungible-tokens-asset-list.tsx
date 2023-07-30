import { Stack } from '@stacks/ui';

import { Brc20TokenAssetItem } from '@app/components/crypto-assets/bitcoin/brc20-token-asset-list/components/brc20-token-asset-item';
import { Brc20Token } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.query';

interface BitcoinFungibleTokenAssetListProps {
  brc20Tokens?: Brc20Token[];
}
export function BitcoinFungibleTokenAssetList({ brc20Tokens }: BitcoinFungibleTokenAssetListProps) {
  if (!brc20Tokens) return null;

  return (
    <Stack spacing="loose">
      {brc20Tokens.map(token => (
        <Brc20TokenAssetItem key={token.tick} token={token} />
      ))}
    </Stack>
  );
}
