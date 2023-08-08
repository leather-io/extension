import { Box, Stack, Text, color } from '@stacks/ui';

import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';

import { SwapAsset } from '../../hooks/use-swap';

interface SwapAssetItemProps {
  asset: SwapAsset;
}
export function SwapAssetItem({ asset }: SwapAssetItemProps) {
  return (
    <Flag align="middle" img={<Box as="img" src={asset.icon} width="40px" />} spacing="base">
      <Stack spacing="none">
        <SpaceBetween>
          <Text fontWeight={500}>{asset.name}</Text>
          <Text fontWeight={500}>{formatMoneyWithoutSymbol(asset.balance)}</Text>
        </SpaceBetween>
        <Text color={color('text-caption')} fontSize={0}>
          {asset.balance.symbol}
        </Text>
      </Stack>
    </Flag>
  );
}
