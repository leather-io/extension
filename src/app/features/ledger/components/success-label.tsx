import { Flex, FlexProps } from 'leather-styles/jsx';

import { CheckmarkIcon } from '@app/ui/components/icons/checkmark-icon';
import { Caption } from '@app/ui/components/typography/caption';

interface LedgerSuccessLabelProps extends FlexProps {
  children: React.ReactNode;
}
export function LedgerSuccessLabel({ children, ...props }: LedgerSuccessLabelProps) {
  return (
    <Flex alignItems="center" color="success.label" flexDirection="row" {...props}>
      <CheckmarkIcon />
      <Caption color="inherited" ml="space.02">
        {children}
      </Caption>
    </Flex>
  );
}
