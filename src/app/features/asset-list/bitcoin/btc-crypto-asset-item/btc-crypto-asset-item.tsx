import type { BtcCryptoAssetBalance } from '@leather-wallet/models';
import { useCryptoCurrencyMarketDataMeanAverage } from '@leather-wallet/query';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';

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
      balance={balance}
      captionLeft="BTC"
      fiatBalance={fiatAvailableBalance}
      icon={<BtcAvatarIcon />}
      isLoading={isLoading}
      onSelectAsset={onSelectAsset}
      titleLeft="Bitcoin"
    />
  );
}
