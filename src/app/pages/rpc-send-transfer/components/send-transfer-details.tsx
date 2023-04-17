import { Stack, Text, color } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

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
      borderColor={color('border')}
      borderRadius="16px"
      p="loose"
      spacing="base"
      width="100%"
    >
      <SpaceBetween spacing="base">
        <Text color={color('text-caption')}>From</Text>
        <Text>{truncateMiddle(currentAddress)}</Text>
      </SpaceBetween>
      <SpaceBetween spacing="base">
        <Text color={color('text-caption')}>To</Text>
        <Text>{truncateMiddle(address)}</Text>
      </SpaceBetween>
      <SpaceBetween spacing="base">
        <Text color={color('text-caption')}>Amount</Text>
        <Text>{amount}</Text>
      </SpaceBetween>
    </Stack>
  );
}
