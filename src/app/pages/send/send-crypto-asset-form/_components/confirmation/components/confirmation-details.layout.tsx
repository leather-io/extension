import { Box, Stack, StackProps, Text } from '@stacks/ui';

import { Money } from '@shared/models/money.model';

import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';

interface ConfirmationDetailsLayoutProps extends StackProps {
  amount: Money;
}
export function ConfirmationDetailsLayout(props: ConfirmationDetailsLayoutProps) {
  const { amount, children } = props;

  return (
    <Box mb="extra-loose" width="100%">
      <Text fontSize="48px" fontWeight={500} mb="48px" textAlign="center" width="100%">
        {convertAmountToBaseUnit(amount).toString()} {amount.symbol.toUpperCase()}
      </Text>
      <Stack fontSize={1} px="extra-tight" spacing="base" width="100%">
        {children}
      </Stack>
    </Box>
  );
}
