import { Stack, StackProps } from '@stacks/ui';
import { useField } from 'formik';

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
    <Stack spacing="base" width="100%" {...rest}>
      <SpaceBetween position="relative">
        <Stack alignItems="center" isInline>
          <Caption>Fee</Caption>
          {!isSponsored ? selectInput : null}
        </Stack>
        {feeField}
      </SpaceBetween>
      {isSponsored && <SponsoredLabel />}
      {!meta.error && fieldWarning && <WarningLabel>{fieldWarning}</WarningLabel>}
    </Stack>
  );
}
