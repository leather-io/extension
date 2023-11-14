import { useField } from 'formik';
import { HstackProps, styled } from 'leather-styles/jsx';
import { HStack } from 'leather-styles/jsx';

import { SponsoredLabel } from '@app/components/sponsored-label';
import { WarningLabel } from '@app/components/warning-label';

interface FeesRowLayoutProps extends HstackProps {
  feeField: React.JSX.Element;
  fieldWarning?: string;
  isSponsored: boolean;
  selectInput: React.JSX.Element;
}
export function FeesRowLayout(props: FeesRowLayoutProps) {
  const { feeField, fieldWarning, isSponsored, selectInput, ...rest } = props;
  const [_, meta] = useField('fee');

  return (
    <HStack gap="space.04" width="100%" {...rest}>
      <HStack alignItems="center" justifyContent="space-between" position="relative" width="100%">
        <HStack alignItems="center" width="100%">
          <styled.span color="accent.text-subdued" textStyle="label.02">
            Fee
          </styled.span>
          {!isSponsored ? selectInput : null}
        </HStack>
        {feeField}
      </HStack>
      {isSponsored && <SponsoredLabel />}
      {!meta.error && fieldWarning && <WarningLabel>{fieldWarning}</WarningLabel>}
    </HStack>
  );
}
