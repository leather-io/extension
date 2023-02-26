import { Stack, Text, color } from '@stacks/ui';

import { Caption } from '@app/components/typography';

interface PsbtDetailsProps {
  payloadTxHex: string;
}
// ts-unused-exports:disable-next-line
export function PsbtDetails({ payloadTxHex }: PsbtDetailsProps) {
  return (
    <Stack
      border="4px solid"
      borderColor={color('border')}
      borderRadius="20px"
      p="base"
      minHeight="180px"
      spacing="tight"
    >
      <Caption>PSBT Hex:</Caption>
      <Text wordWrap="break-word">{payloadTxHex}</Text>
    </Stack>
  );
}
