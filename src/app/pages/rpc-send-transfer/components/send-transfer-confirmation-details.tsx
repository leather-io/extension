import { Stack, Text, color } from '@stacks/ui';

import { SpaceBetween } from '@app/components/layout/space-between';

interface SendTransferConfirmationDetailsProps {
  currentAddress: string;
  fee: string;
  recipient: string;
  time: string;
  total: string;
}
export function SendTransferConfirmationDetails({
  currentAddress,
  fee,
  recipient,
  time,
  total,
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
        <Text>{fee}</Text>
      </SpaceBetween>
      <SpaceBetween spacing="base">
        <Text color={color('text-caption')}>Total</Text>
        <Text>{total}</Text>
      </SpaceBetween>
      <SpaceBetween spacing="base">
        <Text color={color('text-caption')}>Estimated Time</Text>
        <Text>{time}</Text>
      </SpaceBetween>
    </Stack>
  );
}
