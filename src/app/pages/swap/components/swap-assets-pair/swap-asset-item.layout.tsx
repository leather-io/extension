import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { HStack, styled } from 'leather-styles/jsx';

import { Flag } from '@leather.io/ui';

interface SwapAssetItemLayoutProps {
  caption: string;
  icon: string;
  symbol: string;
  value: string;
}
export function SwapAssetItemLayout({ caption, icon, symbol, value }: SwapAssetItemLayoutProps) {
  return (
    <Flag
      img={<styled.img src={icon} borderRadius="50%" width="48px" height="48px" alt="Swap asset" />}
      spacing="space.03"
      width="100%"
    >
      <styled.span color="ink.text-subdued" textStyle="caption.01">
        {caption}
      </styled.span>
      <HStack alignItems="center" justifyContent="space-between">
        <styled.span data-testid={SwapSelectors.SwapDetailsSymbol} textStyle="heading.05">
          {symbol}
        </styled.span>
        <styled.span data-testid={SwapSelectors.SwapDetailsAmount} textStyle="heading.05">
          {value}
        </styled.span>
      </HStack>
    </Flag>
  );
}
