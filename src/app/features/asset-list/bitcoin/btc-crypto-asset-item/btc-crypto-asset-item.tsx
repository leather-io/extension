import type { BtcCryptoAssetBalance } from '@leather-wallet/models';
import { useCryptoCurrencyMarketDataMeanAverage } from '@leather-wallet/query';
import { BtcAvatarIcon } from '@leather-wallet/ui';
import { baseCurrencyAmountInQuote, i18nFormatCurrency } from '@leather-wallet/utils';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';

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
    <CryptoAssetItemLayout
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
