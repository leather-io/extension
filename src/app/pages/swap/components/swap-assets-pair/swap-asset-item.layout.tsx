import { HStack, styled } from 'leather-styles/jsx';

import { Flag } from '@app/components/layout/flag';

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
      <HStack alignItems="center" justifyContent="space-between">
        <styled.span textStyle="heading.05">{symbol}</styled.span>
        <styled.span textStyle="heading.05">{value}</styled.span>
      </HStack>
    </Flag>
  );
}
