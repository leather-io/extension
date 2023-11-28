import { Flex, FlexProps } from 'leather-styles/jsx';

import { Spinner } from '@app/ui/components/spinner';
import { Caption } from '@app/ui/components/typography/caption';

interface LookingForLedgerLabelProps extends FlexProps {
  children: React.ReactNode;
}
export function LookingForLedgerLabel({ children, ...props }: LookingForLedgerLabelProps) {
  return (
    <Flex alignItems="center" flexDirection="row" {...props}>
      <Spinner opacity={0.5} />
      <Caption ml="space.02">{children}</Caption>
    </Flex>
  );
}
