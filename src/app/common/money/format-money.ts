import { Money } from '@shared/models/money.model';

export function formatMoney({ amount, symbol }: Money) {
  return `${amount.toString()} ${symbol}`;
}

export function i18nFormatCurrency(value: Money, locale = 'en-US') {
  if (value.symbol !== 'USD') throw new Error('Cannot format non-USD amounts');
  const formatCurrency = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });
  return formatCurrency.format(value.amount.shiftedBy(-value.decimals).toNumber());
}

export function formatDustUsdAmounts(value: string) {
  const thinSpace = ' ';
  return value.endsWith('0.00') ? '<' + thinSpace + value.replace('0.00', '0.01') : value;
}
