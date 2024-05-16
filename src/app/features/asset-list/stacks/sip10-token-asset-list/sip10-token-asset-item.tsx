import type { CryptoAssetBalance, MarketData, Sip10CryptoAssetInfo } from '@leather-wallet/models';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { spamFilter } from '@app/common/utils/spam-filter';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { StacksAssetAvatar } from '@app/components/stacks-asset-avatar';

interface Sip10TokenAssetItemProps {
  assetInfo: Sip10CryptoAssetInfo;
  balance: CryptoAssetBalance;
  marketData: MarketData;
  onClick?(symbol: string, contractId?: string): void;
}
export function Sip10TokenAssetItem({
  assetInfo,
  balance,
  marketData,
  onClick,
}: Sip10TokenAssetItemProps) {
  const name = spamFilter(assetInfo.name);
  const fiatBalance = convertAssetBalanceToFiat({
    balance: balance.availableBalance,
    marketData,
  });

  return (
    <CryptoAssetItemLayout
      balance={balance}
      fiatBalance={fiatBalance}
      caption={assetInfo.symbol}
      contractId={assetInfo.contractId}
      icon={
        <StacksAssetAvatar
          color="white"
          gradientString={assetInfo.contractId}
          imageCanonicalUri={getSafeImageCanonicalUri(assetInfo.imageCanonicalUri, name)}
        >
          {name[0]}
        </StacksAssetAvatar>
      }
      name={name}
      onClick={onClick}
      symbol={assetInfo.symbol}
    />
  );
}
