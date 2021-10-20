import React, { useCallback, useMemo, useState } from 'react';
import { useField } from 'formik';
import { Input, InputGroup, Stack, Text } from '@stacks/ui';
import { microStxToStx, stxToMicroStx } from '@stacks/ui-utils';

import { ErrorLabel } from '@components/error-label';
import { SendFormErrorMessages } from '@common/error-messages';
import { useFeeState } from '@store/transactions/fees.hooks';

import { FeeMultiplier } from './fee-multiplier';

export function IncreaseFeeField(): JSX.Element {
  const [field, meta, helpers] = useField('txFee');
  const [modified, setModified] = useState(false);
  const [fee] = useFeeState();

  const showResetMultiplier = useMemo(() => {
    if (modified) return true;
    if (!fee) return false;
    return stxToMicroStx(field.value) !== fee;
  }, [modified, fee, field.value]);

  const onSelectMultiplier = useCallback(
    (multiplier: number) => {
      if (!fee) return;
      setModified(multiplier !== 1);
      helpers.setValue(microStxToStx(fee * multiplier));
    },
    [fee, helpers]
  );

  const fieldError = useMemo(() => {
    switch (meta.error) {
      case SendFormErrorMessages.AdjustedFeeExceedsBalance:
        return (
          <>
            The fee added now exceeds your current STX balance. Consider lowering the amount being
            sent.
          </>
        );
      default:
        return meta.error;
    }
  }, [meta.error]);

  return (
    <>
      <Stack width="100%" position="relative">
        <FeeMultiplier
          pt="base-loose"
          pr="base-tight"
          height="100%"
          top={0}
          right={0}
          zIndex={99}
          position="absolute"
          showReset={showResetMultiplier}
          onSelectMultiplier={onSelectMultiplier}
        />

        <InputGroup flexDirection="column">
          <Text as="label" display="block" mb="tight" fontSize={1} fontWeight="500" htmlFor="fee">
            Fee
          </Text>
          <Input
            display="block"
            type="number"
            width="100%"
            placeholder="Enter a custom fee"
            autoComplete="off"
            {...field}
          />
        </InputGroup>
      </Stack>
      {meta.error && (
        <ErrorLabel>
          <Text textStyle="caption" lineHeight="18px">
            {fieldError}
          </Text>
        </ErrorLabel>
      )}
    </>
  );
}
