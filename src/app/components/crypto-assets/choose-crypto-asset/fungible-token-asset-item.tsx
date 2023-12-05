import { FlexProps } from 'leather-styles/jsx';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { StacksFungibleTokenAssetItem } from '@app/components/crypto-assets/stacks/fungible-token-asset/stacks-fungible-token-asset-item';

interface FungibleTokenAssetItemProps extends FlexProps {
  assetBalance: StacksFungibleTokenAssetBalance;
  onClick(): void;
}
export function FungibleTokenAssetItem({ assetBalance, onClick }: FungibleTokenAssetItemProps) {
  const { blockchain } = assetBalance;

  switch (blockchain) {
    case 'stacks':
      return (
        <StacksFungibleTokenAssetItem assetBalance={assetBalance} isPressable onClick={onClick} />
      );
    default:
      return null;
  }
}
