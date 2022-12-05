import { Tooltip } from '@stacks/ui';
import { TransactionSigningSelectors } from '@tests-legacy/page-objects/transaction-signing.selectors';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { Money } from '@shared/models/money.model';

import { formatDustUsdAmounts, i18nFormatCurrency } from '@app/common/money/format-money';
import { Caption } from '@app/components/typography';

interface TransactionFeeProps {
  fee: string | number;
  feeCurrencySymbol: CryptoCurrencies;
  usdAmount: Money | null;
}
export function TransactionFee({ fee, feeCurrencySymbol, usdAmount }: TransactionFeeProps) {
  const feeLabel = (
    <Caption data-testid={TransactionSigningSelectors.FeeToBePaidLabel}>
      {fee} {feeCurrencySymbol}
    </Caption>
  );
  if (!usdAmount || usdAmount.amount.isNaN()) return feeLabel;
  return <Tooltip label={formatDustUsdAmounts(i18nFormatCurrency(usdAmount))}>{feeLabel}</Tooltip>;
}
