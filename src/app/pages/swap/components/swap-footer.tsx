import { useFormikContext } from 'formik';

import { InfoCardFooter } from '@app/components/info-card/info-card';
import { PreviewButton } from '@app/components/preview-button';

export function SwapFooter() {
  const { dirty, isValid, isSubmitting } = useFormikContext();

  return (
    <InfoCardFooter>
      <PreviewButton
        isDisabled={!(dirty && isValid)}
        isLoading={isSubmitting}
        mb="0px"
        text="Review and swap"
      />
    </InfoCardFooter>
  );
}
