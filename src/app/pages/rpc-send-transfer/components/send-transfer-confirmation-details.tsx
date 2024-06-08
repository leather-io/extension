import { HStack, Stack, styled } from 'leather-styles/jsx';

import type { Money } from '@leather-wallet/models';
import { formatMoney } from '@leather-wallet/utils';

interface SendTransferConfirmationDetailsProps {
  currentAddress: string;
  recipient: string;
  amount: Money;
}
export function SendTransferConfirmationDetails({
  currentAddress,
  recipient,
  amount,
}: SendTransferConfirmationDetailsProps) {
  return (
    <Stack border="active" borderRadius="sm" p="space.05" gap="space.04" width="100%">
      <HStack alignItems="center" gap="space.04" justifyContent="space-between">
        <styled.span color="ink.text-subdued">From</styled.span>
        <styled.span>{currentAddress}</styled.span>
      </HStack>
      <HStack alignItems="center" gap="space.04" justifyContent="space-between">
        <styled.span color="ink.text-subdued">To</styled.span>
        <styled.span>{recipient}</styled.span>
      </HStack>
      <HStack alignItems="center" gap="space.04" justifyContent="space-between">
        <styled.span color="ink.text-subdued">Amount</styled.span>
        <styled.span>{formatMoney(amount)}</styled.span>
      </HStack>
    </Stack>
  );
}
