import { atom } from 'jotai';

import { assetsAnchoredState } from '@app/store/assets/tokens';
import { getFullyQualifiedAssetName } from '@app/common/hooks/use-selected-asset';
import { AssetWithMeta } from '@app/common/asset-types';
import { atomWithDefault } from 'jotai/utils';

export const selectedAssetIdState = atom<string | undefined>(undefined);

export const selectedAssetStore = atom<AssetWithMeta | undefined>(get => {
  const fqn = get(selectedAssetIdState);
  const assets = get(assetsAnchoredState);
  return assets?.find(asset => getFullyQualifiedAssetName(asset) === fqn);
});
selectedAssetStore.debugLabel = 'selectedAssetStore';

export const searchInputStore = atom<string>('');
searchInputStore.debugLabel = 'searchInputStore';

const searchResultState = atomWithDefault<AssetWithMeta[] | undefined>(get =>
  get(assetsAnchoredState)
);
searchResultState.debugLabel = 'searchResultState';
