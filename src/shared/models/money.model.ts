import { isBigInt, isUndefined } from '@leather-wallet/utils';
import BigNumber from 'bignumber.js';

import { BTC_DECIMALS, STX_DECIMALS } from '@shared/constants';

import type { Currencies } from './currencies.model';

export type NumType = BigNumber | bigint | number;

export interface Money {
  readonly amount: BigNumber;
  readonly symbol: Currencies;
  readonly decimals: number;
}

// Units of `Money` should be declared in their smallest unit. Similar to
// Rosetta, we model currencies with their respective resolution
const currencyDecimalsMap = {
  BTC: BTC_DECIMALS,
  STX: STX_DECIMALS,
  USD: 2,
} as const;

type KnownCurrencyDecimals = keyof typeof currencyDecimalsMap;

function isResolutionOfCurrencyKnown(symbol: Currencies): symbol is KnownCurrencyDecimals {
  return symbol in currencyDecimalsMap;
}

function getDecimalsOfSymbolIfKnown(symbol: Currencies) {
  if (isResolutionOfCurrencyKnown(symbol)) return currencyDecimalsMap[symbol];
  return null;
}

function throwWhenDecimalUnknown(
  symbol: Currencies,
  decimals?: number
): asserts decimals is number {
  if (isUndefined(decimals) && isUndefined(getDecimalsOfSymbolIfKnown(symbol)))
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
  const decimals = getDecimalsOfSymbolIfKnown(symbol) ?? resolution;
  const amount = new BigNumber(isBigInt(value) ? value.toString() : value).shiftedBy(decimals);
  return Object.freeze({ amount, symbol, decimals });
}

/**
 * @param value Amount described in currency's fractional base unit, e.g. cents for USD amounts
 * @param symbol Identifying letter code, e.g. EUR
 * @param resolution Optional, required if value not known at build-time
 */
export function createMoney(value: NumType, symbol: Currencies, resolution?: number): Money {
  throwWhenDecimalUnknown(symbol, resolution);
  const decimals = getDecimalsOfSymbolIfKnown(symbol) ?? resolution;
  const amount = new BigNumber(isBigInt(value) ? value.toString() : value);
  return Object.freeze({ amount, symbol, decimals });
}
