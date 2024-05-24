import { unitToFractionalUnit } from '@leather-wallet/utils';

import type { MarketData } from '@shared/models/market.model';
import { type Money, createMoney } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { isMoneyGreaterThanZero } from '@app/common/money/money.utils';

export function convertInputAmountValueToFiat(balance: Money, price: MarketData, value: string) {
  const valueAsMoney = createMoney(
    unitToFractionalUnit(balance.decimals)(value),
    balance.symbol,
    balance.decimals
  );

  if (!isMoneyGreaterThanZero(valueAsMoney)) return;
  return baseCurrencyAmountInQuote(valueAsMoney, price);
}
