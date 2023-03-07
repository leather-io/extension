import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';

import { Box, Flex } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField } from 'formik';

import { ErrorLabel } from '@app/components/error-label';

const closedHeight = 0;
const openHeight = 24;

export function FieldError(props: { name: string }) {
  const { name } = props;
  const [, meta] = useField(name);
  const [showHide, setShowHide] = useState(closedHeight);

  const showError = meta.touched && meta.error;

  useEffect(() => {
    if (meta.touched && meta.error) {
      setShowHide(openHeight);
      return;
    }
    setShowHide(closedHeight);
  }, [meta.error, meta.touched]);

  if (!showError) return <Box height={closedHeight + 'px'} />;

  return (
    <Flex mb="tight" width="100%">
      <AnimateHeight duration={400} easing="ease-out" height={showHide}>
        <Flex height={openHeight + 'px'}>
          <ErrorLabel data-testid={SendCryptoAssetSelectors.FormFieldInputErrorLabel} fontSize={1}>
            {meta.error}
          </ErrorLabel>
        </Flex>
      </AnimateHeight>
    </Flex>
  );
}
