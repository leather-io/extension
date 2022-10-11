import { Tooltip } from '@stacks/ui';

import { TransactionSigningSelectors } from '@tests/page-objects/transaction-signing.selectors';
import { formatDustUsdAmounts, i18nFormatCurrency, Money } from '@shared/models/money.model';

interface TransactionFeeProps {
  fee: string | number;
  usdAmount: Money | null;
}
export function TransactionFee({ fee, usdAmount }: TransactionFeeProps) {
  const feeLabel = (
    <span data-testid={TransactionSigningSelectors.FeeToBePaidLabel}>{fee} STX</span>
  );
  if (!usdAmount) return feeLabel;
  return <Tooltip label={formatDustUsdAmounts(i18nFormatCurrency(usdAmount))}>{feeLabel}</Tooltip>;
}
