import BigNumber from 'bignumber.js';
import { Currencies } from './currencies.model';

export interface Money {
  readonly amount: BigNumber;
  readonly symbol: Currencies;
}

export function createMoney(amount: BigNumber | number, symbol: Currencies): Money {
  return { amount: new BigNumber(amount), symbol };
}

export function formatMoney({ amount, symbol }: Money) {
  return `${amount.toString()} ${symbol}`;
}

export function i18nFormatCurrency(value: Money, locale = 'en-US') {
  if (value.symbol !== 'USD') throw new Error('Cannot format non-USD amounts');

  const formatCurrency = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });

  return formatCurrency.format(value.amount.toNumber());
}

export function formatDustUsdAmounts(value: string) {
  const thinSpace = ' ';
  return value.endsWith('0.00') ? '<' + thinSpace + value.replace('0.00', '0.01') : value;
}
