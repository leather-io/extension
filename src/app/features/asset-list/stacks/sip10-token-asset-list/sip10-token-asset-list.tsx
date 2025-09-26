import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { Stack } from 'leather-styles/jsx';

import { type AssetFilter } from '@app/common/hooks/use-manage-tokens';
import {
  useManagedSip10Tools,
  useSip10AccountBalance,
} from '@app/query/stacks/sip10/sip10-balance.hooks';

import type { AssetRightElementVariant } from '../../asset-list';
import { Sip10TokenAssetItem } from './sip10-token-asset-item';

interface Sip10TokenAssetListProps {
  accountIndex: number;
  assetFilter?: AssetFilter;
  assetRightElementVariant?: AssetRightElementVariant;
  onSelectAsset?(symbol: string, contractId?: string): void;
  setHasManageableTokens?: Dispatch<SetStateAction<boolean>>;
}

export function Sip10TokenAssetList({
  accountIndex,
  assetFilter = 'all',
  onSelectAsset,
  assetRightElementVariant,
  setHasManageableTokens,
}: Sip10TokenAssetListProps) {
  const sip10s = useSip10AccountBalance(accountIndex, {
    includeHiddenAssets: assetFilter === 'all',
  });
  const { isEnabled } = useManagedSip10Tools(accountIndex);

  useEffect(() => {
    if (sip10s.value && sip10s.value.sip10s.length > 0 && setHasManageableTokens) {
      setHasManageableTokens(true);
    }
  }, [sip10s, setHasManageableTokens]);

  if (sip10s.state !== 'success' && !sip10s.value) return null;

  return (
    <Stack>
      {sip10s.value.sip10s.map(sip10 => (
        <Sip10TokenAssetItem
          key={sip10.asset.assetId}
          assetRightElementVariant={assetRightElementVariant}
          balance={sip10}
          isEnabled={isEnabled(sip10)}
          onSelectAsset={onSelectAsset}
        />
      ))}
    </Stack>
  );
}
