import { BigNumber } from 'bignumber.js';

import { createMoney, Money } from '@shared/models/money.model';
import { formatMarketPair, MarketData } from '@shared/models/market.model';
import { formatMoney } from './format-money';
import { isMoney } from './is-money';
import { isNumber } from '@shared/utils';

export function baseCurrencyAmountInQuote(quantity: Money, { pair, price }: MarketData) {
  if (quantity.symbol !== pair.base)
    throw new Error(
      `Cannot calculate value of ${formatMoney(quantity)} with market pair of ${formatMarketPair(
        pair
      )}`
    );

  return createMoney(
    convertAmountToFractionalUnit(
      convertAmountToBaseUnit(quantity).times(convertAmountToBaseUnit(price)),
      price.decimals
    ),
    pair.quote
  );
}

export function convertAmountToFractionalUnit(num: Money | BigNumber, decimals?: number) {
  if (isMoney(num)) return num.amount.shiftedBy(num.decimals);
  if (!isNumber(decimals)) throw new Error('Must define decimal of given currency');
  return num.shiftedBy(decimals);
}

// ts-unused-exports:disable-next-line
export function convertAmountToBaseUnit(num: Money | BigNumber, decimals?: number) {
  if (isMoney(num)) return num.amount.shiftedBy(-num.decimals);
  if (!isNumber(decimals)) throw new Error('Must define decimal of given currency');
  return num.shiftedBy(-decimals);
}
