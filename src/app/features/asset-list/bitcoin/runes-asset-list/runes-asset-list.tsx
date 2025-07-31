import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { RunesAvatarIcon } from '@leather.io/ui';

import { formatCurrency } from '@app/common/currency-formatter';
import { type AssetFilter } from '@app/common/hooks/use-manage-tokens';
import { CryptoAssetItem } from '@app/components/crypto-asset-item/crypto-asset-item';
import { useManagedRunesAccountBalance } from '@app/query/bitcoin/runes/runes-balance.query';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

import type { AssetRightElementVariant } from '../../asset-list';

interface RunesAssetListProps {
  accountIndex: number;
  filter?: AssetFilter;
  assetRightElementVariant?: AssetRightElementVariant;
  setHasManageableTokens?: Dispatch<SetStateAction<boolean>>;
}

export function RunesAssetList({
  accountIndex,
  filter = 'all',
  assetRightElementVariant,
  setHasManageableTokens,
}: RunesAssetListProps) {
  const isPrivate = useIsPrivateMode();
  const {
    runes,
    isLoading,
    isEnabled: isRuneEnabled,
  } = useManagedRunesAccountBalance(accountIndex, filter);

  useEffect(() => {
    if (!isLoading && runes!.length > 0 && setHasManageableTokens) {
      setHasManageableTokens(true);
    }
  }, [isLoading, runes, setHasManageableTokens]);

  if (isLoading || !runes || !runes.length) return null;

  return runes.map((rune, i) => {
    const key = `${rune.asset.symbol}${i}`;
    const captionLeft = 'Runes';
    const icon = <RunesAvatarIcon />;
    const titleLeft = rune.asset.spacedRuneName ?? rune.asset.runeName;

    return (
      <CryptoAssetItem
        key={key}
        isToggleMode={assetRightElementVariant === 'toggle'}
        toggleProps={{
          captionLeft,
          icon,
          titleLeft,
          assetId: rune.asset.runeName,
          isCheckedByDefault: isRuneEnabled(rune),
        }}
        itemProps={{
          availableBalance: rune.crypto.totalBalance,
          captionLeft,
          icon,
          isPrivate,
          titleLeft,
          fiatBalance: formatCurrency(rune.quote.totalBalance),
          dataTestId: rune.asset.runeName,
        }}
      />
    );
  });
}
