import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { RunesAvatarIcon } from '@leather.io/ui';

import { formatCurrency } from '@app/common/currency-formatter';
import { type AssetFilter } from '@app/common/hooks/use-manage-tokens';
import { CryptoAssetItem } from '@app/components/crypto-asset-item/crypto-asset-item';
import {
  useManagedRunesTools,
  useRunesAccountBalance,
} from '@app/query/bitcoin/runes/runes-balance.query';
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
  const runes = useRunesAccountBalance(accountIndex, {
    includeHiddenAssets: filter === 'all',
  });
  const { isEnabled } = useManagedRunesTools(accountIndex);

  useEffect(() => {
    if (runes.value && runes.value.runes.length > 0 && setHasManageableTokens) {
      setHasManageableTokens(true);
    }
  }, [runes, setHasManageableTokens]);

  if (runes.state !== 'success' && !runes.value) return null;

  return runes.value.runes.map((rune, i) => {
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
          isCheckedByDefault: isEnabled(rune),
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
