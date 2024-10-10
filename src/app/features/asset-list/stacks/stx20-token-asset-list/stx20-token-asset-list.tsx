import { type Dispatch, type SetStateAction, useEffect } from 'react';

import type { CryptoAssetBalance, Stx20CryptoAssetInfo } from '@leather.io/models';

import { useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { CryptoAssetItemToggleLayout } from '@app/components/crypto-asset-item/crypto-asset-item-toggle.layout';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';
import { Stx20AvatarIcon } from '@app/ui/components/avatar/stx20-avatar-icon';

import type { AssetRightElementVariant } from '../../asset-list';

interface Stx20TokenAssetDetails {
  balance: CryptoAssetBalance;
  info: Stx20CryptoAssetInfo;
}

interface Stx20TokenAssetListProps {
  tokens: Stx20TokenAssetDetails[];
  assetRightElementVariant?: AssetRightElementVariant;
  preEnabledTokensIds: string[];
  setHasManageableTokens?: Dispatch<SetStateAction<boolean>>;
}
export function Stx20TokenAssetList({
  tokens,
  assetRightElementVariant,
  preEnabledTokensIds,
  setHasManageableTokens,
}: Stx20TokenAssetListProps) {
  const isPrivate = useIsPrivateMode();
  const { isTokenEnabled } = useManageTokens();

  useEffect(() => {
    if (tokens.length > 0 && setHasManageableTokens) {
      setHasManageableTokens(true);
    }
  }, [tokens, setHasManageableTokens]);

  return tokens.map((token, i) => {
    const key = `${token.info.symbol}${i}`;
    const captionLeft = token.info.name.toUpperCase();
    const icon = <Stx20AvatarIcon />;
    const titleLeft = token.info.symbol;

    if (assetRightElementVariant === 'toggle') {
      return (
        <CryptoAssetItemToggleLayout
          key={key}
          captionLeft={captionLeft}
          icon={icon}
          titleLeft={titleLeft}
          isCheckedByDefault={isTokenEnabled({ tokenId: key, preEnabledTokensIds })}
          assetId={token.info.symbol}
        />
      );
    }

    return (
      <CryptoAssetItemLayout
        availableBalance={token.balance.availableBalance}
        captionLeft={token.info.name.toUpperCase()}
        icon={<Stx20AvatarIcon />}
        key={`${token.info.symbol}${i}`}
        titleLeft={token.info.symbol}
        isPrivate={isPrivate}
        dataTestId={token.info.symbol}
      />
    );
  });
}
