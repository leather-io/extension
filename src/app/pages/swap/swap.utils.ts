import type { MarketData, Money } from '@leather.io/models';
import type { SwapAsset } from '@leather.io/query';
import {
  baseCurrencyAmountInQuote,
  createMoney,
  i18nFormatCurrency,
  isMoneyGreaterThanZero,
  unitToFractionalUnit,
} from '@leather.io/utils';

export function convertSwapAssetBalanceToFiat(asset: SwapAsset) {
  if (
    !asset.marketData ||
    (!!asset.balance &&
      isMoneyGreaterThanZero(asset.balance) &&
      !isMoneyGreaterThanZero(asset.marketData.price))
  )
    // adjustment for assets with balance but no price data
    return '-';
  return i18nFormatCurrency(baseCurrencyAmountInQuote(asset.balance, asset.marketData));
}

export function convertInputAmountValueToFiat(balance: Money, price: MarketData, value: string) {
  const valueAsMoney = createMoney(
    unitToFractionalUnit(balance.decimals)(value),
    balance.symbol,
    balance.decimals
  );

  if (!isMoneyGreaterThanZero(valueAsMoney)) return;
  return baseCurrencyAmountInQuote(valueAsMoney, price);
}

export function toCommaSeparatedWithAnd(list: string[]) {
  let result = '';
  if (list.length) result = list[list.length - 1];
  if (list.length > 1) result = `${list[list.length - 2]} and ${result}`;
  if (list.length > 2) result = `${list.slice(0, -2).join(', ')}, ${result}`;
  return result;
}

export function sortSwapAssets(assets: SwapAsset[]) {
  return assets
    .sort((a, b) => {
      const nameA = (a.displayName ?? a.name).toLowerCase();
      const nameB = (b.displayName ?? b.name).toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    })
    .sort((a, b) => {
      if (a.name === 'STX') return -1;
      if (b.name !== 'STX') return 1;
      return 0;
    })
    .sort((a, b) => {
      if (a.name === 'BTC') return -1;
      if (b.name !== 'BTC') return 1;
      return 0;
    });
}
