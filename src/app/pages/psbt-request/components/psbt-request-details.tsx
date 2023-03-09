import { Stack, Text, color } from '@stacks/ui';

import { Caption } from '@app/components/typography';

interface PsbtRequestDetailsProps {
  payloadTxHex: string;
}
export function PsbtRequestDetails({ payloadTxHex }: PsbtRequestDetailsProps) {
  return (
    <Stack
      border="4px solid"
      borderColor={color('border')}
      borderRadius="20px"
      p="base"
      minHeight="180px"
      spacing="tight"
    >
      <Caption>PSBT hex:</Caption>
      <Text wordWrap="break-word">{payloadTxHex}</Text>
    </Stack>
  );
}
