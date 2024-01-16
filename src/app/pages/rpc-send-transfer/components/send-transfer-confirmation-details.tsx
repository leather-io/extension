import { HStack, Stack, styled } from 'leather-styles/jsx';

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
    <Stack border="active" borderRadius="sm" p="space.05" gap="space.04" width="100%">
      <HStack alignItems="center" gap="space.04" justifyContent="space-between">
        <styled.span color="accent.styled.span-subdued">From</styled.span>
        <styled.span>{currentAddress}</styled.span>
      </HStack>
      <HStack alignItems="center" gap="space.04" justifyContent="space-between">
        <styled.span color="accent.styled.span-subdued">To</styled.span>
        <styled.span>{recipient}</styled.span>
      </HStack>
      <HStack alignItems="center" gap="space.04" justifyContent="space-between">
        <styled.span color="accent.styled.span-subdued">Fee</styled.span>
        <styled.span>{feeRowValue}</styled.span>
      </HStack>
      <HStack alignItems="center" gap="space.04" justifyContent="space-between">
        <styled.span color="accent.styled.span-subdued">Total</styled.span>
        <styled.span>{total}</styled.span>
      </HStack>
      {time && (
        <HStack alignItems="center" gap="space.04" justifyContent="space-between">
          <styled.span color="accent.styled.span-subdued">Estimated Time</styled.span>
          <styled.span>{time}</styled.span>
        </HStack>
      )}
    </Stack>
  );
}
