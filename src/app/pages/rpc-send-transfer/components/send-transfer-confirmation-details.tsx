import { Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { SpaceBetween } from '@app/components/layout/space-between';

interface SendTransferConfirmationDetailsProps {
  currentAddress: string;
  recipient: string;
  time: string;
  total: string;
  feeRowValue: string;
}
export function SendTransferConfirmationDetails({
  currentAddress,
  recipient,
  time,
  total,
  feeRowValue,
}: SendTransferConfirmationDetailsProps) {
  return (
    <Stack
      border="4px solid"
      borderColor={token('colors.accent.background-primary')}
      borderRadius="16px"
      p="space.05"
      gap="space.04"
      width="100%"
    >
      <SpaceBetween spacing="space.04">
        <styled.span color={token('colors.accent.text-subdued')}>From</styled.span>
        <styled.span>{currentAddress}</styled.span>
      </SpaceBetween>
      <SpaceBetween spacing="space.04">
        <styled.span color={token('colors.accent.text-subdued')}>To</styled.span>
        <styled.span>{recipient}</styled.span>
      </SpaceBetween>
      <SpaceBetween spacing="space.04">
        <styled.span color={token('colors.accent.text-subdued')}>Fee</styled.span>
        <styled.span>{feeRowValue}</styled.span>
      </SpaceBetween>
      <SpaceBetween spacing="space.04">
        <styled.span color={token('colors.accent.text-subdued')}>Total</styled.span>
        <styled.span>{total}</styled.span>
      </SpaceBetween>
      {time && (
        <SpaceBetween spacing="space.04">
          <styled.span color={token('colors.accent.text-subdued')}>Estimated Time</styled.span>
          <styled.span>{time}</styled.span>
        </SpaceBetween>
      )}
    </Stack>
  );
}
