import { Tooltip } from '@stacks/ui';
import { TransactionSigningSelectors } from '@tests-legacy/page-objects/transaction-signing.selectors';

import { Money } from '@shared/models/money.model';

import { formatDustUsdAmounts, i18nFormatCurrency } from '@app/common/money/format-money';

interface TransactionFeeProps {
  fee: string | number;
  usdAmount: Money | null;
}
export function TransactionFee({ fee, usdAmount }: TransactionFeeProps) {
  const feeLabel = (
    <span data-testid={TransactionSigningSelectors.FeeToBePaidLabel}>{fee} STX</span>
  );
  if (!usdAmount || usdAmount.amount.isNaN()) return feeLabel;
  return <Tooltip label={formatDustUsdAmounts(i18nFormatCurrency(usdAmount))}>{feeLabel}</Tooltip>;
}
