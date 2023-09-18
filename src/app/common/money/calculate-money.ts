import { BigNumber } from 'bignumber.js';

import { MarketData, formatMarketPair } from '@shared/models/market.model';
import { Money, NumType, createMoney } from '@shared/models/money.model';
import { isNumber } from '@shared/utils';

import { initBigNumber, sumNumbers } from '../math/helpers';
import { formatMoney } from './format-money';
import { isMoney } from './is-money';

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

export function convertToMoneyTypeWithDefaultOfZero(
  symbol: string,
  num?: NumType,
  decimals?: number
) {
  return createMoney(initBigNumber(num ?? 0), symbol.toUpperCase(), decimals);
}

// ts-unused-exports:disable-next-line
export function convertAmountToBaseUnit(num: Money | BigNumber, decimals?: number) {
  if (isMoney(num)) return num.amount.shiftedBy(-num.decimals);
  if (!isNumber(decimals)) throw new Error('Must define decimal of given currency');
  return num.shiftedBy(-decimals);
}

export function subtractMoney(xAmount: Money, yAmount: Money) {
  if (xAmount.symbol !== yAmount.symbol) throw new Error('Cannot subtract different currencies');
  return createMoney(xAmount.amount.minus(yAmount.amount), xAmount.symbol, xAmount.decimals);
}

export function sumMoney(moneysArr: Money[]) {
  if (moneysArr.some(item => item.symbol !== moneysArr[0].symbol))
    throw new Error('Cannot sum different currencies');

  const sum = sumNumbers(moneysArr.map(item => item.amount.toNumber()));
  return createMoney(sum, moneysArr[0].symbol, moneysArr[0].decimals);
}
