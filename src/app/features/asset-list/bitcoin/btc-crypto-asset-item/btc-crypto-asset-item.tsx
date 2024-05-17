import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { capitalize } from '@app/common/utils';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import type {
  AccountCryptoAssetWithDetails,
  BtcAccountCryptoAssetWithDetails,
} from '@app/query/models/crypto-asset.model';
import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';

interface BtcCryptoAssetItemProps {
  asset: BtcAccountCryptoAssetWithDetails;
  isLoading: boolean;
  onClick?(asset: AccountCryptoAssetWithDetails): void;
  rightElement?: React.ReactNode;
}
export function BtcCryptoAssetItem({
  asset,
  isLoading,
  onClick,
  rightElement,
}: BtcCryptoAssetItemProps) {
  const marketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  const availableBalanceAsFiat = i18nFormatCurrency(
    baseCurrencyAmountInQuote(asset.balance.availableBalance, marketData)
  );

  return (
    <CryptoAssetItemLayout
      asset={asset}
      fiatBalance={availableBalanceAsFiat}
      icon={<BtcAvatarIcon />}
      isLoading={isLoading}
      name={capitalize(asset.info.name)}
      onClick={onClick}
      rightElement={rightElement}
    />
  );
}
