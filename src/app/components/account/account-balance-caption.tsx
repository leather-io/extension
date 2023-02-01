import { useMediaQuery } from '@stacks/ui';

import type { MarketData } from '@shared/models/market.model';
import type { Money } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { Caption, CaptionSeparatorDot } from '@app/components/typography';

interface AccountBalanceCaptionProps {
  availableBalance: Money;
  marketData: MarketData;
}
export function AccountBalanceCaption({
  availableBalance,
  marketData,
}: AccountBalanceCaptionProps) {
  const [hasSufficientLayoutWidth] = useMediaQuery('(min-width: 320px)');

  return (
    <>
      {hasSufficientLayoutWidth && (
        <>
          <CaptionSeparatorDot />
          <Caption>
            {i18nFormatCurrency(baseCurrencyAmountInQuote(availableBalance, marketData))}
          </Caption>
        </>
      )}
    </>
  );
}

export function AccountBalanceLoading() {
  return (
    <>
      <CaptionSeparatorDot />
      <Caption>Loading…</Caption>
    </>
  );
}
