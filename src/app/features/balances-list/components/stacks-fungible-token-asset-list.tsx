import { Stack } from '@stacks/ui';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { StacksFungibleTokenAssetItem } from '@app/components/crypto-assets/stacks/fungible-token-asset/stacks-fungible-token-asset-item';

interface StacksFungibleTokenAssetListProps {
  assetBalances: StacksFungibleTokenAssetBalance[];
}
export function StacksFungibleTokenAssetList({ assetBalances }: StacksFungibleTokenAssetListProps) {
  return (
    <Stack spacing="loose">
      {assetBalances.map(assetBalance => (
        <StacksFungibleTokenAssetItem
          assetBalance={assetBalance}
          key={assetBalance.asset.contractId}
        />
      ))}
    </Stack>
  );
}
