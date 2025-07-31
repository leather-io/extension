import SbtcAvatarIconSrc from '@assets/avatars/sbtc-avatar-icon.png';

import type { Sip10Balance } from '@leather.io/services';

import { formatCurrency } from '@app/common/currency-formatter';
import { getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { CryptoAssetItem } from '@app/components/crypto-asset-item/crypto-asset-item';
import { StacksAssetAvatar } from '@app/components/stacks-asset-avatar';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

import type { AssetRightElementVariant } from '../../asset-list';

interface Sip10TokenAssetItemProps {
  balance: Sip10Balance;
  isEnabled: boolean;
  assetRightElementVariant?: AssetRightElementVariant;
  onSelectAsset?(symbol: string, contractId?: string): void;
}
export function Sip10TokenAssetItem({
  balance,
  isEnabled,
  onSelectAsset,
  assetRightElementVariant,
}: Sip10TokenAssetItemProps) {
  const isPrivate = useIsPrivateMode();

  const { contractId, assetId, imageCanonicalUri, name, symbol } = balance.asset;

  const icon = (
    <>
      <StacksAssetAvatar
        color="white"
        gradientString={contractId}
        img={
          symbol === 'sBTC' ? SbtcAvatarIconSrc : getSafeImageCanonicalUri(imageCanonicalUri, name)
        }
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
        assetId,
        isCheckedByDefault: isEnabled,
      }}
      itemProps={{
        contractId,
        availableBalance: balance.crypto.availableBalance,
        captionLeft,
        icon,
        isPrivate,
        titleLeft,
        fiatBalance: formatCurrency(balance.quote.availableBalance),
        dataTestId: assetId,
        onSelectAsset,
      }}
    />
  );
}
