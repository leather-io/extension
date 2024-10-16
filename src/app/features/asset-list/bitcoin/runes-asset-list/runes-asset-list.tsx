import { type Dispatch, type SetStateAction, useEffect } from 'react';

import type { CryptoAssetBalance, MarketData, RuneCryptoAssetInfo } from '@leather.io/models';
import { RunesAvatarIcon } from '@leather.io/ui';
import { convertAmountToBaseUnit, createMoneyFromDecimal } from '@leather.io/utils';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { useManageTokens } from '@app/common/hooks/use-manage-tokens';
import { CryptoAssetItem } from '@app/components/crypto-asset-item/crypto-asset-item';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

import type { AssetRightElementVariant } from '../../asset-list';

interface RuneTokenAssetDetails {
  balance: CryptoAssetBalance;
  info: RuneCryptoAssetInfo;
  marketData: MarketData;
}

interface RunesAssetListProps {
  runes: RuneTokenAssetDetails[];
  assetRightElementVariant?: AssetRightElementVariant;
  preEnabledTokensIds: string[];
  setHasManageableTokens?: Dispatch<SetStateAction<boolean>>;
}

export function RunesAssetList({
  runes,
  assetRightElementVariant,
  preEnabledTokensIds,
  setHasManageableTokens,
}: RunesAssetListProps) {
  const isPrivate = useIsPrivateMode();
  const { isTokenEnabled } = useManageTokens();

  useEffect(() => {
    if (runes.length > 0 && setHasManageableTokens) {
      setHasManageableTokens(true);
    }
  }, [runes, setHasManageableTokens]);

  return runes.map((rune, i) => {
    const key = `${rune.info.symbol}${i}`;
    const captionLeft = 'Runes';
    const icon = <RunesAvatarIcon />;
    const titleLeft = rune.info.spacedRuneName ?? rune.info.runeName;

    const availableBalance = createMoneyFromDecimal(
      convertAmountToBaseUnit(rune.balance.availableBalance),
      rune.info.symbol,
      rune.info.decimals
    );
    const fiatBalance = convertAssetBalanceToFiat({
      balance: rune.balance.availableBalance,
      marketData: rune.marketData,
    });

    return (
      <CryptoAssetItem
        key={key}
        isToggleMode={assetRightElementVariant === 'toggle'}
        toggleProps={{
          captionLeft,
          icon,
          titleLeft,
          assetId: rune.info.runeName,
          isCheckedByDefault: isTokenEnabled({ tokenId: rune.info.runeName, preEnabledTokensIds }),
        }}
        itemProps={{
          availableBalance,
          captionLeft,
          icon,
          isPrivate,
          titleLeft,
          fiatBalance,
          dataTestId: rune.info.runeName,
        }}
      />
    );
  });
}
