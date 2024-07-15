import type { BtcCryptoAssetBalance } from '@leather.io/models';
import { useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';
import { BtcAvatarIcon } from '@leather.io/ui';
import { baseCurrencyAmountInQuote, i18nFormatCurrency } from '@leather.io/utils';

import { CryptoAssetItemBalanceLayout } from '@app/components/crypto-asset-item/crypto-asset-item-balance.layout';

interface BtcCryptoAssetItemProps {
  balance: BtcCryptoAssetBalance;
  isLoading: boolean;
  onSelectAsset?(symbol: string): void;
}
export function BtcCryptoAssetItem({ balance, isLoading, onSelectAsset }: BtcCryptoAssetItemProps) {
  const marketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const fiatAvailableBalance = i18nFormatCurrency(
    baseCurrencyAmountInQuote(balance.availableBalance, marketData)
  );

  return (
    <CryptoAssetItemBalanceLayout
      availableBalance={balance.availableBalance}
      captionLeft="BTC"
      fiatBalance={fiatAvailableBalance}
      icon={<BtcAvatarIcon />}
      isLoading={isLoading}
      onSelectAsset={onSelectAsset}
      titleLeft="Bitcoin"
    />
  );
}
