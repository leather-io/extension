import { useField } from 'formik';
import { HstackProps } from 'leather-styles/jsx';
import { HStack } from 'leather-styles/jsx';

import { SponsoredLabel } from '@app/components/sponsored-label';
import { WarningLabel } from '@app/components/warning-label';
import { Caption } from '@app/ui/components/typography/caption';

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
      <HStack alignItems="center" justifyContent="space-between" position="relative">
        <HStack alignItems="center">
          <Caption>Fee</Caption>
          {!isSponsored ? selectInput : null}
        </HStack>
        {feeField}
      </HStack>
      {isSponsored && <SponsoredLabel />}
      {!meta.error && fieldWarning && <WarningLabel>{fieldWarning}</WarningLabel>}
    </HStack>
  );
}
