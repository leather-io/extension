import { color, Flex, Spinner } from '@stacks/ui';

import { Caption } from '@app/components/typography';

export function LookingForLedger() {
  return (
    <Flex alignItems="center" flexDirection="row" my="base">
      <Spinner color={color('text-caption')} opacity={0.5} size="sm" />
      <Caption ml="tight">Looking for your Ledger</Caption>
    </Flex>
  );
}
