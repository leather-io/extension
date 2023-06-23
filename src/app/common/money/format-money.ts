import { Money } from '@shared/models/money.model';

const thinSpace = ' ';

export function formatMoney({ amount, symbol, decimals }: Money) {
  return `${amount.shiftedBy(-decimals).toString()} ${symbol}`;
}

export function formatMoneyWithoutSymbol({ amount, decimals }: Money) {
  return `${amount.shiftedBy(-decimals).toString()}`;
}

export function formatMoneyPadded({ amount, symbol, decimals }: Money) {
  return `${amount.shiftedBy(-decimals).toFormat(decimals)} ${symbol}`;
}

export function i18nFormatCurrency(quantity: Money, locale = 'en-US') {
  if (quantity.symbol !== 'USD') throw new Error('Cannot format non-USD amounts');
  const currencyFormatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });

  const formatted = currencyFormatter.format(
    quantity.amount.shiftedBy(-quantity.decimals).toNumber()
  );

  if (quantity.amount.isGreaterThan(0) && formatted === '$0.00')
    return '<' + thinSpace + formatted.replace('0.00', '0.01');

  return formatted;
}

export function formatDustUsdAmounts(value: string) {
  return value.endsWith('0.00') ? '<' + thinSpace + value.replace('0.00', '0.01') : value;
}
