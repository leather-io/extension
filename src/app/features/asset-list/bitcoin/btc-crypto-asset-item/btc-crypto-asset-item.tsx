import type { AccountQuotedBtcBalance } from '@leather.io/services';
import { BtcAvatarIcon } from '@leather.io/ui';

import { formatCurrency } from '@app/common/currency-formatter';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

interface BtcCryptoAssetItemProps {
  balance: AccountQuotedBtcBalance;
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

  return (
    <CryptoAssetItemLayout
      availableBalance={balance.btc.totalBalance}
      captionLeft="BTC"
      fiatBalance={formatCurrency(balance.quote.totalBalance)}
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
