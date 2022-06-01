import { useMemo } from 'react';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { baseAssetsAnchoredState, mergeAssetBalances } from '@app/store/assets/tokens';
import type { Asset, AssetWithMeta } from '@app/common/asset-types';
import { selectedAssetIdState } from './asset-search';
import {
  useAddressAnchoredAvailableStxBalance,
  useAddressBalances,
  useCurrentAccountAnchoredBalances,
  useCurrentAccountUnanchoredBalances,
} from '@app/query/balance/balance.hooks';
import { useCurrentAccountStxAddressState } from '../accounts/account.hooks';
import { transformAssets } from './utils';
import {
  useAssetsWithMetadata,
  useFungibleTokenMetadata,
} from '@app/query/fungible-tokens/fungible-token-metadata.hooks';
import { formatContractId, getFullyQualifiedAssetName } from '@app/common/utils';
import { isTransferableAsset } from '@app/common/transactions/is-transferable-asset';

export function useAssets() {
  return useAtomValue(baseAssetsAnchoredState);
}

export function useTransferableAssets() {
  const assets = useAssetsWithMetadata();
  return assets.filter(asset => isTransferableAsset(asset));
}

export function useAssetWithMetadata(asset: Asset) {
  const assetMetadata = useFungibleTokenMetadata(
    formatContractId(asset.contractAddress, asset.contractName)
  );
  if (asset.type === 'ft') {
    const canTransfer = assetMetadata ? isTransferableAsset(asset) : false;
    return { ...asset, meta: assetMetadata, canTransfer, hasMemo: canTransfer };
  }
  return asset as AssetWithMeta;
}

export function useSelectedAssetItem() {
  const selectedAssetId = useAtomValue(selectedAssetIdState);
  const assetsWithMetadata = useAssetsWithMetadata();

  return useMemo(
    () =>
      assetsWithMetadata?.find(
        asset => getFullyQualifiedAssetName(asset) === selectedAssetId
      ) as AssetWithMeta,
    [assetsWithMetadata, selectedAssetId]
  );
}

export function useUpdateSelectedAsset() {
  return useUpdateAtom(selectedAssetIdState);
}

export function useStxTokenState(address: string) {
  const balance = useAddressAnchoredAvailableStxBalance(address);
  const { data: unanchoredBalances } = useAddressBalances(address);

  return {
    type: 'stx',
    contractAddress: '',
    balance: balance,
    subBalance: unanchoredBalances?.stx?.balance.minus(unanchoredBalances?.stx.locked) || undefined,
    subtitle: 'STX',
    name: 'Stacks Token',
  } as AssetWithMeta;
}

function useBaseAssetsAnchoredState() {
  const balances = useCurrentAccountAnchoredBalances();
  return transformAssets(balances);
}

function useBaseAssetsUnanchoredState() {
  const { data: balances } = useCurrentAccountUnanchoredBalances();
  return transformAssets(balances);
}

export function useFungibleTokenBaseState() {
  const principal = useCurrentAccountStxAddressState();
  const anchoredAssets = useBaseAssetsAnchoredState();
  const unanchoredAssets = useBaseAssetsUnanchoredState();
  if (!principal) return [];
  return mergeAssetBalances(anchoredAssets, unanchoredAssets, 'ft');
}
