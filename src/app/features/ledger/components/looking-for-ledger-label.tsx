import { color, Flex, FlexProps, Spinner } from '@stacks/ui';

import { Caption } from '@app/components/typography';

interface LookingForLedgerLabelProps extends FlexProps {
  children: React.ReactNode;
}
export function LookingForLedgerLabel({ children, ...props }: LookingForLedgerLabelProps) {
  return (
    <Flex alignItems="center" flexDirection="row" {...props}>
      <Spinner color={color('text-caption')} opacity={0.5} size="sm" />
      <Caption ml="tight">{children}</Caption>
    </Flex>
  );
}
