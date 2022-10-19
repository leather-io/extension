import { useMemo } from 'react';

import { AssetWithMeta } from '@app/common/asset-types';
import { isTransferableAsset } from '@app/common/transactions/is-transferable-asset';
import { formatContractId } from '@app/common/utils';

import {
  useGetFungibleTokenMetadataListQuery,
  useGetFungibleTokenMetadataQuery,
} from './fungible-token-metadata.query';
import { useBaseAssetsUnanchored } from '../balance/balance.hooks';

export function useFungibleTokenMetadata(contractId: string) {
  const { data: ftMetadata } = useGetFungibleTokenMetadataQuery(contractId);
  return ftMetadata;
}

export function useAssetsWithMetadata(): AssetWithMeta[] {
  const assets = useBaseAssetsUnanchored();
  const assetMetadata = useGetFungibleTokenMetadataListQuery(
    assets.map(a => formatContractId(a.contractAddress, a.contractName))
  );
  return useMemo(
    () =>
      assets
        .map((asset, i) => ({ ...asset, meta: assetMetadata[i].data }))
        .map(assetWithMetaData => ({
          ...assetWithMetaData,
          canTransfer: isTransferableAsset(assetWithMetaData),
          hasMemo: isTransferableAsset(assetWithMetaData),
        })),
    // We don't want to reevaluate on assetMetadata reference change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assets]
  );
}
