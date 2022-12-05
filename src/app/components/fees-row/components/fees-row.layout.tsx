import { Stack, StackProps } from '@stacks/ui';
import { useField } from 'formik';

import { SpaceBetween } from '@app/components/space-between';
import { SponsoredLabel } from '@app/components/sponsored-label';
import { Caption } from '@app/components/typography';
import { WarningLabel } from '@app/components/warning-label';

import { FeeError } from './fee-error';

interface FeesRowLayoutProps extends StackProps {
  feeField: JSX.Element;
  fieldWarning?: string;
  isSponsored: boolean;
  selectInput: JSX.Element;
}
export function FeesRowLayout(props: FeesRowLayoutProps) {
  const { feeField, fieldWarning, isSponsored, selectInput, ...rest } = props;
  const [_, meta] = useField('fee');

  return (
    <Stack spacing="base" {...rest}>
      <SpaceBetween position="relative">
        <Stack alignItems="center" isInline>
          <Caption>Fees</Caption>
          {!isSponsored ? selectInput : null}
        </Stack>
        {feeField}
      </SpaceBetween>
      {meta.error && <FeeError />}
      {isSponsored && <SponsoredLabel />}
      {!meta.error && fieldWarning && <WarningLabel>{fieldWarning}</WarningLabel>}
    </Stack>
  );
}
