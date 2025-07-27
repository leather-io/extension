import type { MarketData, Money } from '@leather.io/models';
import { baseCurrencyAmountInQuote, isMoneyGreaterThanZero } from '@leather.io/utils';

import { formatCurrency } from '@app/common/currency-formatter';

export function convertAssetBalanceToFiat<
  T extends { balance: Money | null; marketData: MarketData | null },
>(asset: T) {
  if (!asset.marketData || !asset.balance || !isMoneyGreaterThanZero(asset.marketData.price))
    return '';
  return formatCurrency(baseCurrencyAmountInQuote(asset.balance, asset.marketData));
}
