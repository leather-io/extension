// #4164 FIXME migrate Spinner
import { Spinner } from '@stacks/ui';
import { Flex, FlexProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Caption } from '@app/components/typography';

interface LookingForLedgerLabelProps extends FlexProps {
  children: React.ReactNode;
}
export function LookingForLedgerLabel({ children, ...props }: LookingForLedgerLabelProps) {
  return (
    <Flex alignItems="center" flexDirection="row" {...props}>
      <Spinner color={token('colors.accent.text-subdued')} opacity={0.5} size="sm" />
      <Caption ml="space.02">{children}</Caption>
    </Flex>
  );
}
