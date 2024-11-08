import { type Dispatch, type SetStateAction, useEffect } from 'react';

import type { CryptoAssetBalance, Stx20CryptoAssetInfo } from '@leather.io/models';
import { getAssetDisplayName } from '@leather.io/utils';

import { useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { CryptoAssetItem } from '@app/components/crypto-asset-item/crypto-asset-item';
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
    const captionLeft = getAssetDisplayName(token.info).toUpperCase();
    const icon = <Stx20AvatarIcon />;
    const symbol = token.info.symbol;
    const titleLeft = symbol;

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
