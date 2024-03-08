import { Stack } from 'leather-styles/jsx';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { StacksFungibleTokenAssetItemLayout } from '@app/components/crypto-assets/stacks/fungible-token-asset/stacks-fungible-token-asset-item.layout';

interface StacksFungibleTokenAssetListLayoutProps {
  assetBalances: StacksFungibleTokenAssetBalance[];
}
export function StacksFungibleTokenAssetListLayout({
  assetBalances,
}: StacksFungibleTokenAssetListLayoutProps) {
  if (assetBalances.length === 0) return null;
  return (
    <Stack>
      {assetBalances.map(assetBalance => (
        <StacksFungibleTokenAssetItemLayout
          assetBalance={assetBalance}
          key={assetBalance.asset.contractId}
        />
      ))}
    </Stack>
  );
}
