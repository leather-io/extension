import { Stack } from 'leather-styles/jsx';

import { Brc20TokenAssetItemLayout } from '@app/components/crypto-assets/bitcoin/brc20-token-asset-list/components/brc20-token-asset-item.layout';
import { Brc20Token } from '@app/query/bitcoin/bitcoin-client';

interface BitcoinFungibleTokenAssetListProps {
  brc20Tokens?: Brc20Token[];
}
export function BitcoinFungibleTokenAssetList({ brc20Tokens }: BitcoinFungibleTokenAssetListProps) {
  if (!brc20Tokens) return null;

  return (
    <Stack gap="space.05">
      {brc20Tokens.map(token => (
        <Brc20TokenAssetItemLayout key={token.ticker} token={token} />
      ))}
    </Stack>
  );
}
