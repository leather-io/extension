import type { Money } from '@leather-wallet/models';
import { useCalculateBitcoinFiatValue } from '@leather-wallet/query';
import { HStack, Stack, styled } from 'leather-styles/jsx';

import { formatMoney, i18nFormatCurrency } from '@app/common/money/format-money';

import { PsbtRequestDetailsSectionLayout } from './psbt-request-details-section.layout';

export function PsbtRequestFee(props: { fee: Money }) {
  const { fee } = props;
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();

  return (
    <PsbtRequestDetailsSectionLayout>
      <HStack alignItems="center" justifyContent="space-between">
        <styled.span textStyle="label.01">Transaction fee</styled.span>
        <Stack alignItems="flex-end" gap="space.01">
          <styled.span textStyle="label.01">{formatMoney(fee)}</styled.span>
          <styled.span textStyle="caption.01">
            {i18nFormatCurrency(calculateBitcoinFiatValue(fee))}
          </styled.span>
        </Stack>
      </HStack>
    </PsbtRequestDetailsSectionLayout>
  );
}
