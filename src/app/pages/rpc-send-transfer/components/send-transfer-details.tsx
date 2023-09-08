import { truncateMiddle } from '@stacks/ui-utils';
import { Stack } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { SpaceBetween } from '@app/components/layout/space-between';

interface SendTransferDetailsProps {
  address: string;
  amount: string;
  currentAddress: string;
}
export function SendTransferDetails({ address, amount, currentAddress }: SendTransferDetailsProps) {
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
        <styled.span textStyle="caption.01">From</styled.span>
        <styled.span textStyle="label.01">{truncateMiddle(currentAddress)}</styled.span>
      </SpaceBetween>
      <SpaceBetween spacing="space.04">
        <styled.span textStyle="caption.01">To</styled.span>
        <styled.span textStyle="label.01">{truncateMiddle(address)}</styled.span>
      </SpaceBetween>
      <SpaceBetween spacing="space.04">
        <styled.span textStyle="caption.01">Amount</styled.span>
        <styled.span textStyle="label.01">{amount}</styled.span>
      </SpaceBetween>
    </Stack>
  );
}
