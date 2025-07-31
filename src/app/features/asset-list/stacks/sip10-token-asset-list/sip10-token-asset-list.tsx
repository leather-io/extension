import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { Stack } from 'leather-styles/jsx';

import { type AssetFilter } from '@app/common/hooks/use-manage-tokens';
import { useManagedSip10AccountBalance } from '@app/query/stacks/sip10/sip10-balance.hooks';

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
  const {
    sip10s,
    isLoading,
    isEnabled: isSip10Enabled,
  } = useManagedSip10AccountBalance(accountIndex, assetFilter);

  useEffect(() => {
    if (!isLoading && sip10s!.length > 0 && setHasManageableTokens) {
      setHasManageableTokens(true);
    }
  }, [isLoading, sip10s, setHasManageableTokens]);

  if (isLoading || !sip10s || !sip10s.length) return null;

  return (
    <Stack>
      {sip10s.map(sip10 => (
        <Sip10TokenAssetItem
          key={sip10.asset.assetId}
          assetRightElementVariant={assetRightElementVariant}
          balance={sip10}
          isEnabled={isSip10Enabled(sip10)}
          onSelectAsset={onSelectAsset}
        />
      ))}
    </Stack>
  );
}
