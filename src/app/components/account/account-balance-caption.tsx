import { useMemo } from 'react';

import { useMediaQuery } from '@stacks/ui';

import type { MarketData } from '@shared/models/market.model';
import type { Money } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { stacksValue } from '@app/common/stacks-utils';
import { Caption, CaptionSeparatorDot } from '@app/components/typography';

interface AccountBalanceCaptionProps {
  availableBalance: Money;
  marketData: MarketData;
}
export function AccountBalanceCaption({
  availableBalance,
  marketData,
}: AccountBalanceCaptionProps) {
  const balance = useMemo(
    () =>
      stacksValue({
        value: availableBalance.amount ?? 0,
        withTicker: true,
        abbreviate: true,
      }),
    [availableBalance]
  );

  const [hasSufficientLayoutWidth] = useMediaQuery('(min-width: 320px)');

  return (
    <>
      <CaptionSeparatorDot />

      <Caption>{balance}</Caption>
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
