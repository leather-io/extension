import { styled } from 'leather-styles/jsx';

import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';

interface SwapAssetItemLayoutProps {
  icon: string;
  symbol: string;
  value: string;
}
export function SwapAssetItemLayout({ icon, symbol, value }: SwapAssetItemLayoutProps) {
  return (
    <Flag
      align="middle"
      img={<styled.img src={icon} width="32px" height="32px" alt="Swap asset" />}
      spacing="tight"
      width="100%"
    >
      <SpaceBetween>
        <styled.span textStyle="heading.05">{symbol}</styled.span>
        <styled.span textStyle="heading.05">{value}</styled.span>
      </SpaceBetween>
    </Flag>
  );
}
