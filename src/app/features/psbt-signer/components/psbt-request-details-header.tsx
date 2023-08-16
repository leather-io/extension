import { Box, Stack } from '@stacks/ui';
import { styled } from 'leaf-styles/jsx';
import { token } from 'leaf-styles/tokens';

import { LockIcon } from '@app/components/icons/lock-icon';
import { UnlockIcon } from '@app/components/icons/unlock-icon';
import { Tooltip } from '@app/components/tooltip';
import { usePsbtSignerContext } from '@app/features/psbt-signer/psbt-signer.context';

const immutableLabel =
  'Any modification to the transaction, including the fee amount or other inputs/outputs, will invalidate the signature.';
const uncertainLabel =
  'The transaction details can be altered by other participants. This means the final outcome of the transaction might be different than initially agreed upon.';

export function PsbtRequestDetailsHeader() {
  const { isPsbtMutable } = usePsbtSignerContext();
  const labelColor = isPsbtMutable ? token('colors.red.600') : token('colors.accent.text-subdued');

  return (
    <Stack alignItems="center" isInline spacing="tight">
      <styled.h2 textStyle="heading.05">Transaction</styled.h2>
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
              <UnlockIcon color={labelColor} height="12px" width="12px" />
            ) : (
              <LockIcon color={labelColor} height="12px" width="12px" />
            )}
          </Box>
          <styled.span color={labelColor} textStyle="caption.02">
            {isPsbtMutable ? 'Uncertain' : 'Certain'}
          </styled.span>
        </Stack>
      </Tooltip>
    </Stack>
  );
}
