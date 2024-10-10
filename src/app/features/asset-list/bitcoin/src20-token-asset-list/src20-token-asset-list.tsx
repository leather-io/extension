import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { Src20AvatarIcon } from '@leather.io/ui';

import { useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { CryptoAssetItemToggleLayout } from '@app/components/crypto-asset-item/crypto-asset-item-toggle.layout';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import type { Src20TokenAssetDetails } from '@app/components/loaders/src20-tokens-loader';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

import type { AssetRightElementVariant } from '../../asset-list';

interface Src20TokenAssetListProps {
  tokens: Src20TokenAssetDetails[];
  assetRightElementVariant?: AssetRightElementVariant;
  preEnabledTokensIds: string[];
  setHasManageableTokens?: Dispatch<SetStateAction<boolean>>;
}
export function Src20TokenAssetList({
  tokens,
  assetRightElementVariant,
  preEnabledTokensIds,
  setHasManageableTokens,
}: Src20TokenAssetListProps) {
  const isPrivate = useIsPrivateMode();
  const { isTokenEnabled } = useManageTokens();

  useEffect(() => {
    if (tokens.length > 0 && setHasManageableTokens) {
      setHasManageableTokens(true);
    }
  }, [tokens, setHasManageableTokens]);

  return tokens.map((token, i) => {
    const key = `${token.info.id}${i}`;
    const captionLeft = token.info.name.toUpperCase();
    const icon = <Src20AvatarIcon />;
    const titleLeft = token.info.symbol.toUpperCase();

    if (assetRightElementVariant === 'toggle') {
      return (
        <CryptoAssetItemToggleLayout
          key={key}
          captionLeft={captionLeft}
          icon={icon}
          titleLeft={titleLeft}
          assetId={token.info.symbol}
          isCheckedByDefault={isTokenEnabled({ tokenId: token.info.symbol, preEnabledTokensIds })}
        />
      );
    }
    return (
      <CryptoAssetItemLayout
        availableBalance={token.balance.availableBalance}
        captionLeft={captionLeft}
        key={key}
        icon={<Src20AvatarIcon />}
        titleLeft={titleLeft}
        isPrivate={isPrivate}
        dataTestId={token.info.symbol}
      />
    );
  });
}
