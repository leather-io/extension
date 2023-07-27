import { Flex, FlexProps } from 'leather-styles/jsx';

import { AnimatedTickIcon } from '@app/ui/components/icons/animated-tick-icon';
import { Caption } from '@app/ui/components/typography/caption';

interface LedgerSuccessLabelProps extends FlexProps {
  children: React.ReactNode;
}
export function LedgerSuccessLabel({ children, ...props }: LedgerSuccessLabelProps) {
  return (
    <Flex alignItems="center" color="success.label" flexDirection="row" {...props}>
      <AnimatedTickIcon />
      <Caption color="inherit" ml="space.02">
        {children}
      </Caption>
    </Flex>
  );
}
