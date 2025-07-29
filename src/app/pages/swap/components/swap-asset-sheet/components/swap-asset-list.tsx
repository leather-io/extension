import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { Stack } from 'leather-styles/jsx';

import type { SwapAsset } from '@app/query/common/alex-sdk/alex-sdk.hooks';
import { LoadingSpinner } from '@app/components/loading-spinner';

import { SwapAssetItem } from './swap-asset-item';
import { useSwapAssetList } from './use-swap-asset-list';

export interface SwapAssetListProps {
  assets: SwapAsset[];
  type: string;
}
export function SwapAssetList({ assets, type }: SwapAssetListProps) {
  const { selectableAssets, onSelectAsset, isValidPairsLoading, isValidPairsError } = useSwapAssetList({ assets, type });

  if (isValidPairsLoading) {
    return (
      <Stack mb="space.05" p="space.05" width="100%" alignItems="center" justifyContent="center" minHeight="100px">
        <LoadingSpinner />
      </Stack>
    );
  }

  return (
    <Stack mb="space.05" p="space.05" width="100%" data-testid={SwapSelectors.SwapAssetList}>
      {/* Show error message if valid pairs query failed, but still show assets (graceful degradation) */}
      {isValidPairsError && (
        <Stack fontSize="sm" color="yellow.600" p="space.02" mb="space.02">
          Valid pairs filtering unavailable - showing all assets
        </Stack>
      )}
      {selectableAssets.map((asset, idx) => (
        <SwapAssetItem
          asset={asset}
          key={`${asset.tokenId}${idx}`}
          onClick={() => onSelectAsset(asset)}
        />
      ))}
    </Stack>
  );
}
