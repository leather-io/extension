import { FiAlertCircle, FiLock } from 'react-icons/fi';

import { Box, Stack, Text, color } from '@stacks/ui';

import { Tooltip } from '@app/components/tooltip';
import { Title } from '@app/components/typography';
import { usePsbtSignerContext } from '@app/features/psbt-signer/psbt-signer.context';

const immutableLabel =
  'Any modification to the transaction, including the fee amount or other inputs/outputs, will invalidate the signature.';
const uncertainLabel =
  'The transaction details can be altered by other participants. This means the final outcome of the transaction might be different than initially agreed upon.';

export function PsbtRequestDetailsHeader() {
  const { isPsbtMutable } = usePsbtSignerContext();
  const labelColor = isPsbtMutable ? color('feedback-alert') : color('text-caption');

  return (
    <Stack alignItems="center" isInline spacing="tight">
      <Title fontSize={3} fontWeight={500}>
        Transaction
      </Title>
      <Tooltip
        label={isPsbtMutable ? uncertainLabel : immutableLabel}
        maxWidth="230px"
        placement="bottom"
      >
        <Stack
          alignItems="center"
          border="1px solid"
          borderColor={labelColor}
          borderRadius="24px"
          isInline
          px="tight"
          py="extra-tight"
          spacing="extra-tight"
        >
          <Box size="12px">
            {isPsbtMutable ? (
              <FiAlertCircle color={labelColor} size="12px" />
            ) : (
              <FiLock color={labelColor} size="12px" />
            )}
          </Box>
          <Text color={labelColor} fontSize={0}>
            {isPsbtMutable ? 'Uncertain' : 'Certain'}
          </Text>
        </Stack>
      </Tooltip>
    </Stack>
  );
}
