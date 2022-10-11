import { useMemo } from 'react';
import { color } from '@stacks/ui';

import { microStxToStx, stacksValue } from '@app/common/stacks-utils';
import { Caption, Text } from '@app/components/typography';
import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { createMoney, i18nFormatCurrency, Money } from '@shared/models/money.model';
import { MarketData } from '@shared/models/market.model';

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

  return (
    <>
      <Text color={color('text-caption')} fontSize="10px">
        •
      </Text>
      <Caption>{balance}</Caption>
      {availableBalance.amount.isGreaterThan(0) && (
        <>
          <Text color={color('text-caption')} fontSize="10px">
            •
          </Text>
          <Caption>
            {i18nFormatCurrency(
              baseCurrencyAmountInQuote(
                createMoney(microStxToStx(availableBalance.amount), 'STX'),
                marketData
              )
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
