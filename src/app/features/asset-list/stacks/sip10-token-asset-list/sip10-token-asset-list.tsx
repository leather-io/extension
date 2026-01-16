import { type Dispatch, type SetStateAction, useEffect, useMemo } from 'react';

import { Stack } from 'leather-styles/jsx';

import { type AssetFilter } from '@app/common/hooks/use-manage-tokens';
import { useConfigSbtc } from '@app/query/common/remote-config/remote-config.query';
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
  const { isSbtcContract } = useConfigSbtc();

  useEffect(() => {
    if (sip10s.value && sip10s.value.sip10s.length > 0 && setHasManageableTokens) {
      setHasManageableTokens(true);
    }
  }, [sip10s, setHasManageableTokens]);

  // Sort tokens to prioritize sBTC first (fixes #6270)
  const sortedSip10s = useMemo(() => {
    if (!sip10s.value?.sip10s) return [];
    return [...sip10s.value.sip10s].sort((a, b) => {
      const aIsSbtc = isSbtcContract(a.asset.contractId);
      const bIsSbtc = isSbtcContract(b.asset.contractId);
      if (aIsSbtc && !bIsSbtc) return -1;
      if (!aIsSbtc && bIsSbtc) return 1;
      return 0;
    });
  }, [sip10s.value?.sip10s, isSbtcContract]);

  if (sip10s.state !== 'success' && !sip10s.value) return null;

  return (
    <Stack>
      {sortedSip10s.map(sip10 => (
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
