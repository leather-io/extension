import { useCallback, useMemo, useState } from 'react';

// #4164 FIXME migrate Input, InputGroup,
import { Input, InputGroup } from '@stacks/ui';
import { useField } from 'formik';
import { Stack, styled } from 'leather-styles/jsx';

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
          pr="space.03"
          height="100%"
          top={0}
          right={0}
          zIndex={99}
          position="absolute"
          showReset={showResetMultiplier}
          onSelectMultiplier={onSelectMultiplier}
        />

        <InputGroup flexDirection="column">
          <styled.label display="block" mb="space.02" textStyle="label.01" htmlFor="fee">
            Fee
          </styled.label>
          <Input
            display="block"
            type="number"
            width="100%"
            placeholder="Enter a custom fee"
            autoComplete="off"
            bg="transparent"
            {...field}
          />
        </InputGroup>
      </Stack>
      {meta.error && (
        <ErrorLabel>
          <styled.span textStyle="caption" lineHeight="18px">
            {meta.error}
          </styled.span>
        </ErrorLabel>
      )}
    </>
  );
}
