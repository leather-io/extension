import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { capitalize } from '@app/common/utils';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';

import type { AssetItem } from '../../asset-list';

interface BtcCryptoAssetItemProps {
  token: AssetItem;
  isLoading: boolean;
  onClick?(symbol: string): void;
  rightElement?: React.ReactNode;
}
export function BtcCryptoAssetItem({
  isLoading,
  token,
  onClick,
  rightElement,
}: BtcCryptoAssetItemProps) {
  const { assetInfo, balance, marketData } = token;
  const availableBalanceAsFiat = i18nFormatCurrency(
    baseCurrencyAmountInQuote(balance.availableBalance, marketData)
  );

  return (
    <CryptoAssetItemLayout
      balance={balance}
      fiatBalance={availableBalanceAsFiat}
      icon={<BtcAvatarIcon />}
      isLoading={isLoading}
      name={capitalize(assetInfo.name)}
      onClick={onClick}
      rightElement={rightElement}
      symbol={assetInfo.symbol}
    />
  );
}
