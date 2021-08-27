import {
  assetItemState,
  assetsAnchoredState,
  fungibleTokensBaseState,
  fungibleTokensState,
  nonFungibleTokensState,
  stxTokenState,
  transferableAssetsState,
} from '@store/assets/tokens';
import { useAtomValue } from 'jotai/utils';
import { useCurrentNetwork } from '@common/hooks/use-current-network';
import type { Asset } from '@common/asset-types';

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
