import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { styled } from 'leather-styles/jsx';

import type { CryptoCurrency, Money } from '@leather.io/models';

import { formatCurrency } from '@app/common/currency-formatter';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface TransactionFeeProps {
  fee: string | number;
  feeCurrencySymbol: CryptoCurrency;
  usdAmount: Money | null;
}
export function TransactionFee({ fee, feeCurrencySymbol, usdAmount }: TransactionFeeProps) {
  const feeLabel = (
    <styled.span
      color="ink.text-subdued"
      data-testid={SharedComponentsSelectors.FeeToBePaidLabel}
      textStyle="label.02"
    >
      {fee} {feeCurrencySymbol}
    </styled.span>
  );
  if (!usdAmount || usdAmount.amount.isNaN()) return feeLabel;
  return <BasicTooltip label={formatCurrency(usdAmount)}>{feeLabel}</BasicTooltip>;
}
