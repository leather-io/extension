import type { BtcCryptoAssetBalance } from '@leather-wallet/models';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { CryptoAssetItemLayout } from '@app/components/crypto-assets/crypto-asset-item/crypto-asset-item.layout';
import { btcCryptoAssetInfo } from '@app/components/crypto-assets/crypto-asset-item/crypto-asset-item.utils';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';

interface BtcBalanceListItemProps {
  address: string;
  balance: BtcCryptoAssetBalance;
  isLoading: boolean;
  rightElement?: React.ReactNode;
}
export function BtcBalanceListItem({
  address,
  balance,
  isLoading,
  rightElement,
}: BtcBalanceListItemProps) {
  const marketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const availableBalanceAsFiat = i18nFormatCurrency(
    baseCurrencyAmountInQuote(balance.availableBalance, marketData)
  );

  return (
    <CryptoAssetItemLayout
      address={address}
      assetBalance={balance}
      balanceAsFiat={availableBalanceAsFiat}
      icon={<BtcAvatarIcon />}
      isLoading={isLoading}
      name={btcCryptoAssetInfo.name}
      rightElement={rightElement}
    />
  );
}
