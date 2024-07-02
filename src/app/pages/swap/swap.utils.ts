import type { MarketData, Money } from '@leather.io/models';
import {
  baseCurrencyAmountInQuote,
  createMoney,
  isMoneyGreaterThanZero,
  unitToFractionalUnit,
} from '@leather.io/utils';

export function convertInputAmountValueToFiat(balance: Money, price: MarketData, value: string) {
  const valueAsMoney = createMoney(
    unitToFractionalUnit(balance.decimals)(value),
    balance.symbol,
    balance.decimals
  );

  if (!isMoneyGreaterThanZero(valueAsMoney)) return;
  return baseCurrencyAmountInQuote(valueAsMoney, price);
}
