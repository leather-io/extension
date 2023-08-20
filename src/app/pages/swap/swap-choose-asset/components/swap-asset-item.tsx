import { Box, Text, color } from '@stacks/ui';

import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';
import { SpaceBetween } from '@app/components/layout/space-between';

import { SwapAsset } from '../../hooks/use-swap';
import { SwapAssetItemLayout } from './swap-asset-item.layout';

interface SwapAssetItemProps {
  asset: SwapAsset;
}
export function SwapAssetItem({ asset }: SwapAssetItemProps) {
  return (
    <SwapAssetItemLayout icon={<Box as="img" src={asset.icon} width="40px" />}>
      <SpaceBetween>
        <Text fontWeight={500}>{asset.name}</Text>
        <Text fontWeight={500}>{formatMoneyWithoutSymbol(asset.balance)}</Text>
      </SpaceBetween>
      <Text color={color('text-caption')} fontSize={0}>
        {asset.balance.symbol}
      </Text>
    </SwapAssetItemLayout>
  );
}
