import { HStack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Tooltip } from '@app/components/tooltip';
import { usePsbtSignerContext } from '@app/features/psbt-signer/psbt-signer.context';
import { LockIcon } from '@app/ui/components/icons/lock-icon';
import { UnlockIcon } from '@app/ui/components/icons/unlock-icon';

const immutableLabel =
  'Any modification to the transaction, including the fee amount or other inputs/outputs, will invalidate the signature.';
const uncertainLabel =
  'The transaction details can be altered by other participants. This means the final outcome of the transaction might be different than initially agreed upon.';

export function PsbtRequestDetailsHeader() {
  const { isPsbtMutable } = usePsbtSignerContext();
  const labelColor = isPsbtMutable
    ? token('colors.error.label')
    : token('colors.accent.text-subdued');

  return (
    <HStack alignItems="center" gap="space.02">
      <styled.h2 textStyle="heading.05">Transaction</styled.h2>
      <Tooltip
        label={isPsbtMutable ? uncertainLabel : immutableLabel}
        maxWidth="230px"
        placement="bottom"
      >
        <HStack
          alignItems="center"
          border="1px solid"
          borderColor={labelColor}
          borderRadius="24px"
          px="space.02"
          py="space.01"
          gap="space.01"
        >
          {isPsbtMutable ? (
            <UnlockIcon color={labelColor} size="icon.xs" />
          ) : (
            <LockIcon color={labelColor} size="icon.xs" />
          )}
          <styled.span color={labelColor} textStyle="caption.02">
            {isPsbtMutable ? 'Uncertain' : 'Certain'}
          </styled.span>
        </HStack>
      </Tooltip>
    </HStack>
  );
}
