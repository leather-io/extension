import { Stack, Text, color } from '@stacks/ui';
import { HStack } from 'leather-styles/jsx';

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
      <HStack alignItems="center" gap="space.04" justifyContent="space-between">
        <Text color={color('text-caption')}>From</Text>
        <Text>{currentAddress}</Text>
      </HStack>
      <HStack alignItems="center" gap="space.04" justifyContent="space-between">
        <Text color={color('text-caption')}>To</Text>
        <Text>{recipient}</Text>
      </HStack>
      <HStack alignItems="center" gap="space.04" justifyContent="space-between">
        <Text color={color('text-caption')}>Fee</Text>
        <Text>{feeRowValue}</Text>
      </HStack>
      <HStack alignItems="center" gap="space.04" justifyContent="space-between">
        <Text color={color('text-caption')}>Total</Text>
        <Text>{total}</Text>
      </HStack>
      {time && (
        <HStack alignItems="center" gap="space.04" justifyContent="space-between">
          <Text color={color('text-caption')}>Estimated Time</Text>
          <Text>{time}</Text>
        </HStack>
      )}
    </Stack>
  );
}
