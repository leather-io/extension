import type { CryptoAssetBalance, MarketData, Sip10CryptoAssetInfo } from '@leather.io/models';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { StacksAssetAvatar } from '@app/components/stacks-asset-avatar';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

interface Sip10TokenAssetItemProps {
  balance: CryptoAssetBalance;
  info: Sip10CryptoAssetInfo;
  isLoading: boolean;
  marketData: MarketData;
  onSelectAsset?(symbol: string, contractId?: string): void;
}
export function Sip10TokenAssetItem({
  balance,
  info,
  isLoading,
  marketData,
  onSelectAsset,
}: Sip10TokenAssetItemProps) {
  const isPrivate = useIsPrivateMode();
  const fiatBalance = convertAssetBalanceToFiat({
    balance: balance.availableBalance,
    marketData,
  });
  const { contractId, imageCanonicalUri, name, symbol } = info;

  return (
    <CryptoAssetItemLayout
      availableBalance={balance.availableBalance}
      fiatBalance={fiatBalance}
      captionLeft={symbol}
      contractId={contractId}
      icon={
        <StacksAssetAvatar
          color="white"
          gradientString={contractId}
          imageCanonicalUri={getSafeImageCanonicalUri(imageCanonicalUri, name)}
        >
          {name[0]}
        </StacksAssetAvatar>
      }
      isLoading={isLoading}
      isPrivate={isPrivate}
      onSelectAsset={onSelectAsset}
      titleLeft={name}
    />
  );
}
