import { useCallback, useMemo, useState } from 'react';

import { useField } from 'formik';
import { Flex, Stack, styled } from 'leather-styles/jsx';

import { microStxToStx, stxToMicroStx } from '@app/common/money/unit-conversion';
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
    (multiplier: number) => {
      if (!currentFee) return;
      setModified(multiplier !== 1);
      helpers.setValue(microStxToStx(currentFee * multiplier));
    },
    [currentFee, helpers]
  );

  return (
    <>
      <Stack position="relative" width="100%">
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

        <Flex>
          <styled.label display="block" fontSize={1} fontWeight={500} mb="space.02" htmlFor="fee">
            Fee
          </styled.label>
          <styled.input
            _focus={{ border: 'focus' }}
            autoComplete="off"
            autoFocus
            bg="transparent"
            border="default"
            borderRadius="sm"
            height="64px"
            display="block"
            p="space.04"
            placeholder="Enter a custom fee"
            ring="none"
            textStyle="body.02"
            width="100%"
            {...field}
          />
        </Flex>
      </Stack>
      {meta.error && <ErrorLabel>{meta.error}</ErrorLabel>}
    </>
  );
}
