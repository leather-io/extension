import { HStack, styled } from 'leather-styles/jsx';

import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';

import { SwapAsset } from '../../hooks/use-swap';
import { SwapAssetItemLayout } from './swap-asset-item.layout';

interface SwapAssetItemProps {
  asset: SwapAsset;
}
export function SwapAssetItem({ asset }: SwapAssetItemProps) {
  return (
    <SwapAssetItemLayout
      icon={<styled.img src={asset.icon} width="40px" height="40px" alt="Swap asset" />}
    >
      <HStack alignItems="center" justifyContent="space-between">
        <styled.span textStyle="label.01">{asset.name}</styled.span>
        <styled.span textStyle="label.01">{formatMoneyWithoutSymbol(asset.balance)}</styled.span>
      </HStack>
      <styled.span textStyle="caption.01">{asset.balance.symbol}</styled.span>
    </SwapAssetItemLayout>
  );
}
