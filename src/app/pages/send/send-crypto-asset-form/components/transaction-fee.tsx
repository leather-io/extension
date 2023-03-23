import { Tooltip } from '@stacks/ui';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { Money } from '@shared/models/money.model';

import { formatDustUsdAmounts, i18nFormatCurrency } from '@app/common/money/format-money';
import { Caption } from '@app/components/typography';

interface TransactionFeeProps {
  fee: string | number;
  usdAmount: Money | null;
}
export function TransactionFee({ fee, usdAmount }: TransactionFeeProps) {
  const feeLabel = (
    <Caption data-testid={SharedComponentsSelectors.FeeToBePaidLabel}>{fee}</Caption>
  );
  if (!usdAmount || usdAmount.amount.isNaN()) return feeLabel;
  return <Tooltip label={formatDustUsdAmounts(i18nFormatCurrency(usdAmount))}>{feeLabel}</Tooltip>;
}
