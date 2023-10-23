import { HStack, styled } from 'leather-styles/jsx';

import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';
import { usePressable } from '@app/components/item-hover';

import { useAlexSdkBalanceAsFiat } from '../../hooks/use-alex-sdk-fiat-price';
import { SwapAsset } from '../../hooks/use-swap-form';
import { SwapAssetItemLayout } from './swap-asset-item.layout';

interface SwapAssetItemProps {
  asset: SwapAsset;
}
export function SwapAssetItem({ asset }: SwapAssetItemProps) {
  const [component, bind] = usePressable(true);
  const balanceAsFiat = useAlexSdkBalanceAsFiat(asset.balance, asset.price);

  return (
    <SwapAssetItemLayout
      icon={<styled.img src={asset.icon} width="40px" height="40px" alt="Swap asset" />}
      {...bind}
    >
      <HStack alignItems="center" justifyContent="space-between">
        <styled.span textStyle="label.01">{asset.name}</styled.span>
        <styled.span textStyle="label.01">{formatMoneyWithoutSymbol(asset.balance)}</styled.span>
      </HStack>
      <HStack alignItems="center" justifyContent="space-between">
        <styled.span textStyle="caption.01">{asset.name}</styled.span>
        <styled.span color="accent.text-subdued" textStyle="caption.01">
          {balanceAsFiat}
        </styled.span>
      </HStack>
      {component}
    </SwapAssetItemLayout>
  );
}
