import BigNumber from 'bignumber.js';

import { createMoney, formatMoney, Money } from '@shared/models/money.model';
import { formatMarketPair, MarketData } from '@shared/models/market.model';

export function baseCurrencyAmountInQuote(quantity: Money, { pair, price }: MarketData) {
  if (quantity.symbol !== pair.base)
    throw new Error(
      `Cannot calculate value of ${formatMoney(quantity)} with market pair of ${formatMarketPair(
        pair
      )}`
    );

  return createMoney(new BigNumber(quantity.amount).times(price.amount), pair.quote);
}
