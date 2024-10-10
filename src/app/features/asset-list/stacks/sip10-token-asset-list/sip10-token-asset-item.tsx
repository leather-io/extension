import type { CryptoAssetBalance, MarketData, Sip10CryptoAssetInfo } from '@leather.io/models';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { CryptoAssetItemToggleLayout } from '@app/components/crypto-asset-item/crypto-asset-item-toggle.layout';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { StacksAssetAvatar } from '@app/components/stacks-asset-avatar';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

import type { AssetRightElementVariant } from '../../asset-list';

interface Sip10TokenAssetItemProps {
  balance: CryptoAssetBalance;
  info: Sip10CryptoAssetInfo;
  isLoading: boolean;
  marketData: MarketData;
  assetRightElementVariant?: AssetRightElementVariant;
  onSelectAsset?(symbol: string, contractId?: string): void;
  preEnabledTokensIds: string[];
}
export function Sip10TokenAssetItem({
  balance,
  info,
  isLoading,
  marketData,
  onSelectAsset,
  assetRightElementVariant,
  preEnabledTokensIds,
}: Sip10TokenAssetItemProps) {
  const isPrivate = useIsPrivateMode();
  const fiatBalance = convertAssetBalanceToFiat({
    balance: balance.availableBalance,
    marketData,
  });
  const { isTokenEnabled } = useManageTokens();

  const { contractId, imageCanonicalUri, name, symbol } = info;

  const icon = (
    <StacksAssetAvatar
      color="white"
      gradientString={contractId}
      imageCanonicalUri={getSafeImageCanonicalUri(imageCanonicalUri, name)}
    >
      {name[0]}
    </StacksAssetAvatar>
  );

  if (assetRightElementVariant === 'toggle') {
    return (
      <CryptoAssetItemToggleLayout
        assetId={contractId}
        captionLeft={symbol}
        icon={icon}
        titleLeft={name}
        isCheckedByDefault={isTokenEnabled({ tokenId: contractId, preEnabledTokensIds })}
      />
    );
  }

  return (
    <CryptoAssetItemLayout
      availableBalance={balance.availableBalance}
      fiatBalance={fiatBalance}
      captionLeft={symbol}
      contractId={contractId}
      icon={icon}
      isLoading={isLoading}
      isPrivate={isPrivate}
      onSelectAsset={onSelectAsset}
      titleLeft={name}
      dataTestId={contractId}
    />
  );
}
