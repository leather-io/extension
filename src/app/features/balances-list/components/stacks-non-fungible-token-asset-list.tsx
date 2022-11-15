import { Stack } from '@stacks/ui';

import type { StacksNonFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { StacksNonFungibleTokenAssetItem } from '@app/components/crypto-assets/stacks/non-fungible-token-asset/stacks-non-fungible-token-asset-item';

interface StacksNftCryptoAssetsProps {
  assetBalances: StacksNonFungibleTokenAssetBalance[];
}
export function StacksNonFungibleTokenAssetList({ assetBalances }: StacksNftCryptoAssetsProps) {
  return (
    <Stack spacing="loose">
      {assetBalances.map(assetBalance => (
        <StacksNonFungibleTokenAssetItem
          assetBalance={assetBalance}
          key={assetBalance.asset.name}
        />
      ))}
    </Stack>
  );
}
