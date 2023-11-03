import { BoxProps } from '@stacks/ui';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { StacksFungibleTokenAssetItem } from '@app/components/crypto-assets/stacks/fungible-token-asset/stacks-fungible-token-asset-item';

interface FungibleTokenAssetItemProps extends BoxProps {
  assetBalance: StacksFungibleTokenAssetBalance;
}
export function FungibleTokenAssetItem(props: FungibleTokenAssetItemProps) {
  const { assetBalance } = props;
  const { blockchain } = assetBalance;

  switch (blockchain) {
    case 'stacks':
      // TODO #4383 make sure the parent onClick works
      return <StacksFungibleTokenAssetItem assetBalance={assetBalance} isPressable />;
    default:
      return null;
  }
}
