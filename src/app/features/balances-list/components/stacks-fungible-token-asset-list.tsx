import { Stack } from '@stacks/ui';

import { StacksFungibleTokenAssetItem } from '@app/components/crypto-assets/stacks/fungible-token-asset/stacks-fungible-token-asset-item';
import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

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
