import { Flex, FlexProps } from 'leather-styles/jsx';

import { Caption } from '@app/ui/components/typography/caption';
import { CheckmarkIcon } from '@app/ui/icons';

interface LedgerSuccessLabelProps extends FlexProps {
  children: React.ReactNode;
}
export function LedgerSuccessLabel({ children, ...props }: LedgerSuccessLabelProps) {
  return (
    <Flex alignItems="center" color="success.label" flexDirection="row" {...props}>
      <CheckmarkIcon />
      <Caption color="inherit" ml="space.02">
        {children}
      </Caption>
    </Flex>
  );
}
