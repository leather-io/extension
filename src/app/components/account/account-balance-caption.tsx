import type { MarketData } from '@shared/models/market.model';
import type { Money } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { Caption } from '@app/components/typography';

interface AccountBalanceCaptionProps {
  availableBalance: Money;
  marketData: MarketData;
}
export function AccountBalanceCaption({
  availableBalance,
  marketData,
}: AccountBalanceCaptionProps) {
  return (
    <Caption>{i18nFormatCurrency(baseCurrencyAmountInQuote(availableBalance, marketData))}</Caption>
  );
}

export function AccountBalanceLoading() {
  return <Caption>Loading…</Caption>;
}
