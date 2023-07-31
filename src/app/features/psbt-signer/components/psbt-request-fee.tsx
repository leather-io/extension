import { Stack, Text, color } from '@stacks/ui';

import { Money } from '@shared/models/money.model';

import { formatMoney, i18nFormatCurrency } from '@app/common/money/format-money';
import { SpaceBetween } from '@app/components/layout/space-between';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';

import { PsbtRequestDetailsSectionLayout } from './psbt-request-details-section.layout';

export function PsbtRequestFee(props: { fee: Money }) {
  const { fee } = props;
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();

  return (
    <PsbtRequestDetailsSectionLayout>
      <SpaceBetween>
        <Text fontSize={2} fontWeight="500">
          Transaction fee
        </Text>
        <Stack alignItems="flex-end" spacing="extra-tight">
          <Text fontSize={2} fontWeight="500">
            {formatMoney(fee)}
          </Text>
          <Text color={color('text-caption')} fontSize={1}>
            {i18nFormatCurrency(calculateBitcoinFiatValue(fee))}
          </Text>
        </Stack>
      </SpaceBetween>
    </PsbtRequestDetailsSectionLayout>
  );
}
