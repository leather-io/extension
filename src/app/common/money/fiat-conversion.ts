import type { CryptoCurrencies } from '@shared/models/currencies.model';
import { createMarketData, createMarketPair } from '@shared/models/market.model';
import { type Money } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from './calculate-money';

export function checkIsMoneyAmountGreaterThanZero(money: Money) {
  return !(money.amount.isNaN() || money.amount.isZero());
}

export function convertCryptoCurrencyMoneyToFiat(
  currency: CryptoCurrencies,
  price: Money,
  money: Money
) {
  const cryptoCurrencyMarketData = createMarketData(createMarketPair(currency, 'USD'), price);
  return baseCurrencyAmountInQuote(money, cryptoCurrencyMarketData);
}
