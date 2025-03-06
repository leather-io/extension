import type { CryptoAssetBalance, MarketData, Sip10CryptoAssetInfo } from '@leather.io/models';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { CryptoAssetItem } from '@app/components/crypto-asset-item/crypto-asset-item';
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
    <>
      <StacksAssetAvatar
        color="white"
        gradientString={contractId}
        img={getSafeImageCanonicalUri(imageCanonicalUri, name)}
      >
        {name[0]}
      </StacksAssetAvatar>
    </>
  );

  const captionLeft = symbol;
  const titleLeft = name;

  return (
    <CryptoAssetItem
      isToggleMode={assetRightElementVariant === 'toggle'}
      toggleProps={{
        captionLeft,
        icon,
        titleLeft,
        assetId: contractId,
        isCheckedByDefault: isTokenEnabled({ tokenId: contractId, preEnabledTokensIds }),
      }}
      itemProps={{
        contractId,
        availableBalance: balance.availableBalance,
        captionLeft,
        icon,
        isLoading,
        isPrivate,
        titleLeft,
        fiatBalance,
        dataTestId: contractId,
        onSelectAsset,
      }}
    />
  );
}
