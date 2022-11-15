import { Stack } from '@stacks/ui';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { StacksFungibleTokenAssetItem } from '@app/components/crypto-assets/stacks/fungible-token-asset/stacks-fungible-token-asset-item';

interface StacksFtCryptoAssetsProps {
  assetBalances: StacksFungibleTokenAssetBalance[];
}
export function StacksFungibleTokenAssetList({ assetBalances }: StacksFtCryptoAssetsProps) {
  return (
    <Stack spacing="loose">
      {assetBalances.map(assetBalance => (
        <StacksFungibleTokenAssetItem assetBalance={assetBalance} key={assetBalance.asset.name} />
      ))}
    </Stack>
  );
}
