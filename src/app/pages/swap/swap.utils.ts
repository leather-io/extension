import type { MarketData, Money } from '@leather-wallet/models';
import {
  baseCurrencyAmountInQuote,
  createMoney,
  isMoneyGreaterThanZero,
  unitToFractionalUnit,
} from '@leather-wallet/utils';

export function convertInputAmountValueToFiat(balance: Money, price: MarketData, value: string) {
  const valueAsMoney = createMoney(
    unitToFractionalUnit(balance.decimals)(value),
    balance.symbol,
    balance.decimals
  );

  if (!isMoneyGreaterThanZero(valueAsMoney)) return;
  return baseCurrencyAmountInQuote(valueAsMoney, price);
}
