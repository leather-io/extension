import type { CryptoAssetBalance, MarketData, Sip10CryptoAssetInfo } from '@leather-wallet/models';
import { spamFilter } from '@leather-wallet/utils';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { StacksAssetAvatar } from '@app/components/stacks-asset-avatar';

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
  const name = spamFilter(info.name);
  const fiatBalance = convertAssetBalanceToFiat({
    balance: balance.availableBalance,
    marketData,
  });

  return (
    <CryptoAssetItemLayout
      availableBalance={balance.availableBalance}
      fiatBalance={fiatBalance}
      captionLeft={info.symbol}
      contractId={info.contractId}
      icon={
        <StacksAssetAvatar
          color="white"
          gradientString={info.contractId}
          imageCanonicalUri={getSafeImageCanonicalUri(info.imageCanonicalUri, name)}
        >
          {name[0]}
        </StacksAssetAvatar>
      }
      isLoading={isLoading}
      onSelectAsset={onSelectAsset}
      titleLeft={name}
    />
  );
}
