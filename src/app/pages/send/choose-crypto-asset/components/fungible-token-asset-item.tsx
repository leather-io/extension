import { BoxProps } from 'leather-styles/jsx';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { StacksFungibleTokenAssetItem } from '@app/components/crypto-assets/stacks/fungible-token-asset/stacks-fungible-token-asset-item';

interface FungibleTokenAssetItemProps extends BoxProps {
  assetBalance: StacksFungibleTokenAssetBalance;
}
export function FungibleTokenAssetItem(props: FungibleTokenAssetItemProps) {
  const { assetBalance, ...rest } = props;
  const { blockchain } = assetBalance;

  switch (blockchain) {
    case 'stacks':
      return <StacksFungibleTokenAssetItem assetBalance={assetBalance} isPressable {...rest} />;
    default:
      return null;
  }
}
