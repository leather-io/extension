import { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { ActivitySelectors } from '@tests/selectors/activity.selectors';
import { Stack, styled } from 'leather-styles/jsx';

import { microStxToStx, stxToMicroStx } from '@leather.io/utils';

import { ErrorLabel } from '@app/components/error-label';

import { FeeMultiplier } from './fee-multiplier';

interface IncreaseFeeFieldProps {
  initialFee: number;
}
export function IncreaseFeeField({ initialFee }: IncreaseFeeFieldProps): React.JSX.Element {
  const [modified, setModified] = useState(false);
  const { getValues, getFieldState, setValue, formState, register } = useFormContext();
  const value = getValues('fee');
  const fieldState = getFieldState('fee', formState);
  const error = fieldState.error;

  const showResetMultiplier = useMemo(() => {
    if (modified) return true;
    if (!value) return false;
    return stxToMicroStx(value).toNumber() !== initialFee;
  }, [modified, value, initialFee]);

  const onSelectMultiplier = useCallback(
    async (multiplier: number) => {
      if (!initialFee) return;
      setModified(multiplier !== 1);
      setValue('fee', microStxToStx(initialFee * multiplier).toNumber());
    },
    [initialFee, setModified, setValue]
  );

  return (
    <>
      <Stack position="relative" width="100%">
        <FeeMultiplier
          pr="space.03"
          height="100%"
          top={0}
          right={0}
          zIndex={99}
          position="absolute"
          showReset={showResetMultiplier}
          onSelectMultiplier={onSelectMultiplier}
        />
        <styled.label htmlFor="fee" display="none">
          Fee
        </styled.label>
        <styled.input
          data-testid={ActivitySelectors.TransactionActionFeeInput}
          _focus={{ border: 'focus' }}
          autoComplete="off"
          bg="transparent"
          border="default"
          borderRadius="sm"
          height="inputHeight"
          display="block"
          p="space.04"
          placeholder="Enter a custom fee"
          ring="none"
          textStyle="body.02"
          width="100%"
          {...register('fee')}
        />
      </Stack>
      {error && <ErrorLabel>{error.message}</ErrorLabel>}
    </>
  );
}
