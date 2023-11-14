import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField } from 'formik';
import { Box, Flex } from 'leather-styles/jsx';

import { useShowFieldError } from '@app/common/form-utils';
import { ErrorLabel } from '@app/components/error-label';

const closedHeight = 0;
const openHeight = 24;

export function TextInputFieldError(props: { name: string }) {
  const { name } = props;
  const [, meta] = useField(name);
  const [showHide, setShowHide] = useState(closedHeight);
  const showError = useShowFieldError(name);

  useEffect(() => {
    if (showError) {
      setShowHide(openHeight);
      return;
    }
    setShowHide(closedHeight);
  }, [showError]);

  if (!showError) return <Box height={closedHeight + 'px'} />;

  return (
    <Flex mb="space.02" width="100%">
      <AnimateHeight duration={400} easing="ease-out" height={showHide}>
        <Flex height={openHeight + 'px'}>
          <ErrorLabel data-testid={SendCryptoAssetSelectors.FormFieldInputErrorLabel}>
            {meta.error}
          </ErrorLabel>
        </Flex>
      </AnimateHeight>
    </Flex>
  );
}
