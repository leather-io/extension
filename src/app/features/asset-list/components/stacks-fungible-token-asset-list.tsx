import { Stack } from 'leather-styles/jsx';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { StacksFungibleTokenAssetItem } from '@app/components/crypto-assets/stacks/fungible-token-asset/stacks-fungible-token-asset-item';

interface StacksFungibleTokenAssetListProps {
  assetBalances: StacksFungibleTokenAssetBalance[];
}
export function StacksFungibleTokenAssetList({ assetBalances }: StacksFungibleTokenAssetListProps) {
  if (assetBalances.length === 0) return null;
  return (
    <Stack gap="space.05">
      {assetBalances.map(assetBalance => (
        <StacksFungibleTokenAssetItem
          assetBalance={assetBalance}
          key={assetBalance.asset.contractId}
        />
      ))}
    </Stack>
  );
}
