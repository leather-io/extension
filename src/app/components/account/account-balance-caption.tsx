import { useMemo } from 'react';
import { color, useMediaQuery } from '@stacks/ui';

import { stacksValue } from '@app/common/stacks-utils';
import { Caption, Text } from '@app/components/typography';
import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { Money } from '@shared/models/money.model';
import { MarketData } from '@shared/models/market.model';
import { formatDustUsdAmounts, i18nFormatCurrency } from '@app/common/money/format-money';

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

  const showFiatConversion =
    availableBalance.amount.isGreaterThan(0) &&
    marketData.price.amount.isPositive() &&
    hasSufficientLayoutWidth;

  return (
    <>
      <Text color={color('text-caption')} fontSize="10px">
        •
      </Text>
      <Caption>{balance}</Caption>
      {showFiatConversion && hasSufficientLayoutWidth && (
        <>
          <Text color={color('text-caption')} fontSize="10px">
            •
          </Text>
          <Caption>
            {formatDustUsdAmounts(
              i18nFormatCurrency(baseCurrencyAmountInQuote(availableBalance, marketData))
            )}
          </Caption>
        </>
      )}
    </>
  );
}

export function AccountBalanceLoading() {
  return (
    <>
      <Text color={color('text-caption')} fontSize="10px">
        •
      </Text>
      <Caption>Loading…</Caption>
    </>
  );
}
