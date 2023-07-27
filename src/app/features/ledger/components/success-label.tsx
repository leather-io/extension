import { Flex, FlexProps } from 'leather-styles/jsx';

import { AnimatedTick } from '@app/components/animated-tick-icon';
import { Caption } from '@app/ui/components/typography/caption';

interface LedgerSuccessLabelProps extends FlexProps {
  children: React.ReactNode;
}
export function LedgerSuccessLabel({ children, ...props }: LedgerSuccessLabelProps) {
  return (
    <Flex alignItems="center" color="success.label" flexDirection="row" {...props}>
      <AnimatedTick />
      <Caption color="inherit" ml="space.02">
        {children}
      </Caption>
    </Flex>
  );
}
