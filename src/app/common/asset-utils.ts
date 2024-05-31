import type { MarketData, Money } from '@leather-wallet/models';
import {
  baseCurrencyAmountInQuote,
  i18nFormatCurrency,
  isMoneyGreaterThanZero,
} from '@leather-wallet/utils';

export function sortAssetsByName<T extends { name: string }[]>(assets: T) {
  return assets
    .sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
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

export function migratePositiveAssetBalancesToTop<T extends { balance: Money }[]>(assets: T) {
  const assetsWithPositiveBalance = assets.filter(asset => asset.balance.amount.isGreaterThan(0));
  const assetsWithZeroBalance = assets.filter(asset => asset.balance.amount.isEqualTo(0));
  return [...assetsWithPositiveBalance, ...assetsWithZeroBalance] as T;
}

export function convertAssetBalanceToFiat<
  T extends { balance: Money | null; marketData: MarketData | null },
>(asset: T) {
  if (!asset.marketData || !asset.balance || !isMoneyGreaterThanZero(asset.marketData.price))
    return '';
  return i18nFormatCurrency(baseCurrencyAmountInQuote(asset.balance, asset.marketData));
}
