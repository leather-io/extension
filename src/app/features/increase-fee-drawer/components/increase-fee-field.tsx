import { useCallback, useMemo, useState } from 'react';

import { Input, InputGroup, Stack, Text } from '@stacks/ui';
import { useField } from 'formik';

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
            {meta.error}
          </Text>
        </ErrorLabel>
      )}
    </>
  );
}
