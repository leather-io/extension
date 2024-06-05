import { useCallback, useMemo, useState } from 'react';

import { useField } from 'formik';
import { Stack, styled } from 'leather-styles/jsx';

import { microStxToStx, stxToMicroStx } from '@leather.io/utils';

import { ErrorLabel } from '@app/components/error-label';

import { FeeMultiplier } from './fee-multiplier';

interface IncreaseFeeFieldProps {
  currentFee: number;
}
export function IncreaseFeeField(props: IncreaseFeeFieldProps): React.JSX.Element {
  const { currentFee } = props;
  const [field, meta, helpers] = useField('fee');
  const [modified, setModified] = useState(false);

  const showResetMultiplier = useMemo(() => {
    if (modified) return true;
    if (!currentFee) return false;
    return stxToMicroStx(field.value).toNumber() !== currentFee;
  }, [currentFee, modified, field.value]);

  const onSelectMultiplier = useCallback(
    async (multiplier: number) => {
      if (!currentFee) return;
      setModified(multiplier !== 1);
      await helpers.setValue(microStxToStx(currentFee * multiplier));
    },
    [currentFee, helpers]
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
          {...field}
        />
      </Stack>
      {meta.error && <ErrorLabel>{meta.error}</ErrorLabel>}
    </>
  );
}
