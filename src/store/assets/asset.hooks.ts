import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import {
  assetItemState,
  assetsAnchoredState,
  fungibleTokensBaseState,
  fungibleTokensState,
  nonFungibleTokensState,
  stxTokenState,
  transferableAssetsState,
} from '@store/assets/tokens';
import { useCurrentNetwork } from '@common/hooks/use-current-network';
import type { Asset } from '@common/asset-types';
import { searchInputStore, selectedAssetIdState, selectedAssetStore } from './asset-search';

export const useAssets = () => {
  return useAtomValue(assetsAnchoredState);
};

export const useTransferableAssets = () => {
  return useAtomValue(transferableAssetsState);
};

export function useFungibleTokenState() {
  return useAtomValue(fungibleTokensState);
}

export function useAssetItemState(asset: Asset) {
  const network = useCurrentNetwork();
  return useAtomValue(assetItemState([asset, network.url]));
}

export function useFungibleTokenBaseState() {
  return useAtomValue(fungibleTokensBaseState);
}

export function useNonFungibleTokenState() {
  return useAtomValue(nonFungibleTokensState);
}

export function useStxTokenState() {
  return useAtomValue(stxTokenState);
}

export function useSelectedAssetState() {
  return useAtomValue(selectedAssetStore);
}

export function useUpdateSelectedAsset() {
  return useUpdateAtom(selectedAssetIdState);
}

export function useSearchInput() {
  return useAtomValue(searchInputStore);
}

export function useUpdateSearchInput() {
  return useUpdateAtom(searchInputStore);
}
