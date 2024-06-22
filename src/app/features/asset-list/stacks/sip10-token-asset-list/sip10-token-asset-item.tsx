import type { ReactNode } from 'react';

import type { CryptoAssetBalance, MarketData, Sip10CryptoAssetInfo } from '@leather.io/models';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { StacksAssetAvatar } from '@app/components/stacks-asset-avatar';

interface Sip10TokenAssetItemProps {
  balance?: CryptoAssetBalance | null;
  info: Sip10CryptoAssetInfo;
  isLoading?: boolean;
  marketData?: MarketData | null;
  onSelectAsset?(symbol: string, contractId?: string): void;
  renderRightElement?(id: string): ReactNode;
}
export function Sip10TokenAssetItem({
  balance,
  info,
  isLoading = false,
  marketData,
  onSelectAsset,
  renderRightElement,
}: Sip10TokenAssetItemProps) {
  const fiatBalance =
    balance && marketData
      ? convertAssetBalanceToFiat({
          balance: balance.availableBalance,
          marketData,
        })
      : '';
  const { contractId, imageCanonicalUri, name, symbol } = info;

  return (
    <CryptoAssetItemLayout
      availableBalance={balance?.availableBalance}
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
      onSelectAsset={onSelectAsset}
      titleLeft={name}
      renderRightElement={renderRightElement}
    />
  );
}
