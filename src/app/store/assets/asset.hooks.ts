import { useMemo } from 'react';
import { mergeAssetBalances } from '@app/store/assets/tokens';
import type { Asset, AssetWithMeta } from '@app/common/asset-types';
import {
  useAddressAnchoredAvailableStxBalance,
  useAddressBalances,
  useCurrentAccountAnchoredBalances,
  useCurrentAccountUnanchoredBalances,
} from '@app/query/stacks/balance/balance.hooks';
import { useCurrentAccountStxAddressState } from '../accounts/account.hooks';
import { transformAssets } from './utils';
import {
  useAssetsWithMetadata,
  useFungibleTokenMetadata,
} from '@app/query/stacks/fungible-tokens/fungible-token-metadata.hooks';
import { formatContractId, getFullyQualifiedAssetName } from '@app/common/utils';
import { isTransferableAsset } from '@app/common/transactions/is-transferable-asset';

export function useTransferableAssets() {
  const assets = useAssetsWithMetadata();
  return useMemo(() => assets.filter(asset => isTransferableAsset(asset)), [assets]);
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

export function useSelectedAssetMetadata(selectedAssetId: string) {
  const assetsWithMetadata = useAssetsWithMetadata();

  return useMemo(
    () =>
      assetsWithMetadata?.find(
        asset => getFullyQualifiedAssetName(asset) === selectedAssetId
      ) as AssetWithMeta,
    // Render loop occurs when `assetsWithMetadata` in dep array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAssetId]
  );
}

export function useStxTokenState(address: string) {
  const balance = useAddressAnchoredAvailableStxBalance(address);
  const { data: unanchoredBalances } = useAddressBalances(address);

  return {
    type: 'stx',
    contractAddress: '',
    balance: balance,
    subBalance:
      unanchoredBalances?.stx?.balance.amount.minus(unanchoredBalances?.stx.locked.amount) ||
      undefined,
    subtitle: 'STX',
    name: 'Stacks Token',
  } as AssetWithMeta;
}

function useBaseAssetsAnchoredState() {
  const balances = useCurrentAccountAnchoredBalances();
  return useMemo(() => transformAssets(balances), [balances]);
}

function useBaseAssetsUnanchoredState() {
  const { data: balances } = useCurrentAccountUnanchoredBalances();
  return useMemo(() => transformAssets(balances), [balances]);
}

export function useFungibleTokenBaseState() {
  const principal = useCurrentAccountStxAddressState();
  const anchoredAssets = useBaseAssetsAnchoredState();
  const unanchoredAssets = useBaseAssetsUnanchoredState();
  return useMemo(() => {
    if (!principal) return [];
    return mergeAssetBalances(anchoredAssets, unanchoredAssets, 'ft');
  }, [anchoredAssets, principal, unanchoredAssets]);
}
