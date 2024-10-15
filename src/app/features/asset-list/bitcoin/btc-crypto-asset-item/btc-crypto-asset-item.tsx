import type { BtcCryptoAssetBalance } from '@leather.io/models';
import { useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';
import { BtcAvatarIcon } from '@leather.io/ui';
import { baseCurrencyAmountInQuote, i18nFormatCurrency } from '@leather.io/utils';

import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

interface BtcCryptoAssetItemProps {
  balance: BtcCryptoAssetBalance;
  isLoading: boolean;
  isLoadingAdditionalData?: boolean;
  onSelectAsset?(symbol: string): void;
}
export function BtcCryptoAssetItem({
  balance,
  isLoading,
  onSelectAsset,
  isLoadingAdditionalData,
}: BtcCryptoAssetItemProps) {
  const isPrivate = useIsPrivateMode();
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
      isLoadingAdditionalData={isLoadingAdditionalData}
      isPrivate={isPrivate}
      onSelectAsset={onSelectAsset}
      titleLeft="Bitcoin"
      dataTestId="BTC"
    />
  );
}
