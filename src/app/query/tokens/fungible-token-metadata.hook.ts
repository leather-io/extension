import { useMemo } from 'react';

import { isTransferableAsset } from '@app/common/transactions/is-transferable-asset';
import { formatContractId } from '@app/common/utils';
import {
  useGetFungibleTokenMetadataListQuery,
  useGetFungibleTokenMetadataQuery,
} from './fungible-token-metadata.query';
import { AssetWithMeta } from '@app/common/asset-types';
import { useBaseAssetsUnachored } from '../balance/balance.hooks';

export function useFungibleTokenMetadata(contractId: string) {
  const { data: ftMetadata } = useGetFungibleTokenMetadataQuery(contractId);
  return ftMetadata;
}

export function useAssetsWithMetadata(): AssetWithMeta[] {
  const assets = useBaseAssetsUnachored();
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
