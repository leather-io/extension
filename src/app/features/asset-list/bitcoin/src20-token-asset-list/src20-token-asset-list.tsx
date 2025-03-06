import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { Src20AvatarIcon } from '@leather.io/ui';
import { getAssetDisplayName } from '@leather.io/utils';

import { useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { CryptoAssetItem } from '@app/components/crypto-asset-item/crypto-asset-item';
import type { Src20TokenAssetDetails } from '@app/components/loaders/src20-tokens-loader';
import { Src20Image } from '@app/components/src20/src20-image';
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
    const captionLeft = getAssetDisplayName(token.info).toUpperCase();
    const icon = token.info.deploy_img ? (
      <Src20Image src={token.info.deploy_img} />
    ) : (
      <Src20AvatarIcon />
    );
    const titleLeft = token.info.symbol.toUpperCase();
    const symbol = token.info.symbol;

    return (
      <CryptoAssetItem
        key={key}
        isToggleMode={assetRightElementVariant === 'toggle'}
        toggleProps={{
          captionLeft,
          icon,
          titleLeft,
          assetId: symbol,
          isCheckedByDefault: isTokenEnabled({ tokenId: symbol, preEnabledTokensIds }),
        }}
        itemProps={{
          availableBalance: token.balance.availableBalance,
          captionLeft,
          icon,
          isPrivate,
          titleLeft,
          dataTestId: symbol,
        }}
      />
    );
  });
}
