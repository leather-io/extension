import { Flex, FlexProps } from 'leather-styles/jsx';

import { Caption, CheckmarkIcon } from '@leather.io/ui';

interface LedgerSuccessLabelProps extends FlexProps {
  children: React.ReactNode;
}
export function LedgerSuccessLabel({ children, ...props }: LedgerSuccessLabelProps) {
  return (
    <Flex alignItems="center" color="green.action-primary-default" flexDirection="row" {...props}>
      <CheckmarkIcon />
      <Caption color="inherit" ml="space.02">
        {children}
      </Caption>
    </Flex>
  );
}
