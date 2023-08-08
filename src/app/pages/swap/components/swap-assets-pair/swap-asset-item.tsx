import { Box } from '@stacks/ui';

import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Title } from '@app/components/typography';

interface SwapAssetItemProps {
  icon: string;
  symbol: string;
  value: string;
}
export function SwapAssetItem({ icon, symbol, value }: SwapAssetItemProps) {
  return (
    <Flag
      align="middle"
      img={<Box as="img" src={icon} width="32px" />}
      spacing="tight"
      width="100%"
    >
      <SpaceBetween>
        <Title fontSize={3}>{symbol}</Title>
        <Title fontSize={3}>{value}</Title>
      </SpaceBetween>
    </Flag>
  );
}
