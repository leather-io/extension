import { useField } from 'formik';
import { HStack, Stack, StackProps } from 'leather-styles/jsx';

import { SpaceBetween } from '@app/components/layout/space-between';
import { SponsoredLabel } from '@app/components/sponsored-label';
import { Caption } from '@app/components/typography';
import { WarningLabel } from '@app/components/warning-label';

interface FeesRowLayoutProps extends StackProps {
  feeField: React.JSX.Element;
  fieldWarning?: string;
  isSponsored: boolean;
  selectInput: React.JSX.Element;
}
export function FeesRowLayout(props: FeesRowLayoutProps) {
  const { feeField, fieldWarning, isSponsored, selectInput, ...rest } = props;
  const [_, meta] = useField('fee');

  return (
    <Stack gap="space.04" width="100%" {...rest}>
      <SpaceBetween position="relative">
        <HStack alignItems="center">
          <Caption>Fee</Caption>
          {!isSponsored ? selectInput : null}
        </HStack>
        {feeField}
      </SpaceBetween>
      {isSponsored && <SponsoredLabel />}
      {!meta.error && fieldWarning && <WarningLabel>{fieldWarning}</WarningLabel>}
    </Stack>
  );
}
