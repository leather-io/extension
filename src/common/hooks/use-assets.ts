import {
  assetsState,
  fungibleTokensState,
  nonFungibleTokensState,
  stxTokenState,
  transferableAssetsState,
} from '@store/assets/tokens';
import { useAtomValue } from 'jotai/utils';

export const useAssets = () => {
  return useAtomValue(assetsState);
};

export const useTransferableAssets = () => {
  return useAtomValue(transferableAssetsState);
};

export function useFungibleTokenState() {
  return useAtomValue(fungibleTokensState);
}

export function useNonFungibleTokenState() {
  return useAtomValue(nonFungibleTokensState);
}

export function useStxTokenState() {
  return useAtomValue(stxTokenState);
}
