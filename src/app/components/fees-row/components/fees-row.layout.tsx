import { useField } from 'formik';
import { HStack, HstackProps, styled } from 'leather-styles/jsx';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { SponsoredLabel } from '@app/components/sponsored-label';
import { WarningLabel } from '@app/components/warning-label';
import { InfoIcon } from '@app/ui/components/icons/info-icon';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

const feesInfo =
  'Higher fees increase the likelihood of your transaction getting confirmed before others. Click to learn more.';
const url = 'https://hiro.so/questions/fee-estimates';

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
    <HStack gap="space.04" width="100%" {...rest} flexWrap="wrap">
      <HStack alignItems="center" justifyContent="space-between" position="relative" width="100%">
        <HStack alignItems="center" width="100%">
          <BasicTooltip label={feesInfo} side="bottom">
            <HStack gap="space.01">
              <styled.span color="accent.text-subdued" textStyle="label.02">
                Fee
              </styled.span>
              <InfoIcon color="accent.text-subdued" onClick={() => openInNewTab(url)} size="xs" />
            </HStack>
          </BasicTooltip>
          {!isSponsored ? selectInput : null}
        </HStack>
        {feeField}
      </HStack>
      {isSponsored && <SponsoredLabel />}
      {!meta.error && fieldWarning && <WarningLabel width="100%">{fieldWarning}</WarningLabel>}
    </HStack>
  );
}
