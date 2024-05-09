import { FlexProps } from 'leather-styles/jsx';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { StacksFungibleTokenAssetItemLayout } from '../../components/crypto-assets/stacks/fungible-token-asset/stacks-fungible-token-asset-item.layout';

interface FungibleTokenAssetItemProps extends FlexProps {
  assetBalance: StacksFungibleTokenAssetBalance;
  onClick(): void;
}
export function FungibleTokenAssetItem({ assetBalance, onClick }: FungibleTokenAssetItemProps) {
  const { blockchain } = assetBalance;

  switch (blockchain) {
    case 'stacks':
      return <StacksFungibleTokenAssetItemLayout assetBalance={assetBalance} onClick={onClick} />;
    default:
      return null;
  }
}
