import type { MarketData, Money } from '@leather.io/models';
import {
  baseCurrencyAmountInQuote,
  i18nFormatCurrency,
  isMoneyGreaterThanZero,
} from '@leather.io/utils';

export function convertAssetBalanceToFiat<
  T extends { balance: Money | null; marketData: MarketData | null },
>(asset: T) {
  if (!asset.marketData || !asset.balance || !isMoneyGreaterThanZero(asset.marketData.price))
    return '';
  return i18nFormatCurrency(baseCurrencyAmountInQuote(asset.balance, asset.marketData));
}
