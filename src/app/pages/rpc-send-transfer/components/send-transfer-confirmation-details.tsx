import { Stack, Text, color } from '@stacks/ui';

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
      borderColor={color('border')}
      borderRadius="16px"
      p="loose"
      spacing="base"
      width="100%"
    >
      <SpaceBetween spacing="base">
        <Text color={color('text-caption')}>From</Text>
        <Text>{currentAddress}</Text>
      </SpaceBetween>
      <SpaceBetween spacing="base">
        <Text color={color('text-caption')}>To</Text>
        <Text>{recipient}</Text>
      </SpaceBetween>
      <SpaceBetween spacing="base">
        <Text color={color('text-caption')}>Fee</Text>
        <Text>{feeRowValue}</Text>
      </SpaceBetween>
      <SpaceBetween spacing="base">
        <Text color={color('text-caption')}>Total</Text>
        <Text>{total}</Text>
      </SpaceBetween>
      {time && (
        <SpaceBetween spacing="base">
          <Text color={color('text-caption')}>Estimated Time</Text>
          <Text>{time}</Text>
        </SpaceBetween>
      )}
    </Stack>
  );
}
