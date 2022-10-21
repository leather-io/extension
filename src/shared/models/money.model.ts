import BigNumber from 'bignumber.js';

import { BTC_DECIMALS, STX_DECIMALS } from '@shared/constants';
import { isUndefined } from '@shared/utils';

import type { Currencies } from './currencies.model';

type NumType = BigNumber | number;

export interface Money {
  readonly amount: BigNumber;
  readonly symbol: Currencies;
  readonly decimals: number;
}

// Units of `Money` should be declared in their smallest unit. Similar to
// Rosetta, we model currencies with their respective resolution
export const currencydecimalsMap: Record<Currencies, number> = {
  BTC: BTC_DECIMALS,
  STX: STX_DECIMALS,
  USD: 2,
};

function throwWhenDecimalUnknown(symbol: Currencies, decimals?: number) {
  if (isUndefined(decimals) && isUndefined(currencydecimalsMap[symbol]))
    throw new Error(`Resolution of currency ${symbol} is unknown, must be described`);
}

/**
 * @param value Amount described in currency's primary unit
 * @param symbol Identifying letter code, e.g. EUR
 * @param resolution Optional, required if value not known at build-time
 */
export function createMoneyFromDecimal(
  value: NumType,
  symbol: Currencies,
  resolution?: number
): Money {
  throwWhenDecimalUnknown(symbol, resolution);
  const decimals = currencydecimalsMap[symbol] ?? resolution;
  const amount = new BigNumber(value).shiftedBy(decimals);
  return Object.freeze({ amount, symbol, decimals });
}

/**
 * @param value Amount described in currency's fractional base unit, e.g. cents for USD amounts
 * @param symbol Identifying letter code, e.g. EUR
 * @param resolution Optional, required if value not known at build-time
 */
export function createMoney(value: NumType, symbol: Currencies, resolution?: number): Money {
  throwWhenDecimalUnknown(symbol, resolution);
  const decimals = currencydecimalsMap[symbol] ?? resolution;
  const amount = new BigNumber(value);
  return Object.freeze({ amount, symbol, decimals });
}
