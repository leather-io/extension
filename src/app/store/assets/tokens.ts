import BigNumber from 'bignumber.js';

import { AssetWithMeta, NftMeta } from '@app/common/asset-types';
import { formatContractId } from '@app/common/utils';

export function mergeAssetBalances(
  anchoredAssets: AssetWithMeta[],
  unanchoredAssets: AssetWithMeta[],
  assetType: string
) {
  const assetMap = new Map();
  // Merge both balances (unanchored and anchored)
  anchoredAssets.forEach(
    asset =>
      asset.type === assetType &&
      assetMap.set(formatContractId(asset.contractAddress, asset.contractName), {
        ...asset,
        ...{ subBalance: new BigNumber(0) },
      })
  );
  unanchoredAssets.forEach(asset => {
    if (asset.type !== assetType) return;
    const key = formatContractId(asset.contractAddress, asset.contractName);
    const match = assetMap.get(key);
    if (match) {
      match.subBalance = asset?.balance;
    } else {
      assetMap.set(key, {
        ...asset,
        subBalance: asset.balance,
        balance: new BigNumber(0),
      });
    }
  });
  return [...assetMap.values()] as AssetWithMeta[];
}

export type NftMetaRecord = Record<string, NftMeta>;

export function mergeNftBalances(anchoredNfts: NftMetaRecord, unanchoredNfts: NftMetaRecord) {
  const assets = Object.keys(anchoredNfts);
  const assetMap = new Map();
  // Merge both balances (unanchored and anchored)
  assets.forEach(asset =>
    assetMap.set(asset, { ...anchoredNfts[asset], ...{ subCount: '0', key: asset } })
  );

  Object.keys(unanchoredNfts).forEach(key => {
    const asset = unanchoredNfts[key];
    if (!assetMap.has(key)) {
      assetMap.set(key, { ...asset, ...{ subCount: asset.count, count: '0', key } });
    } else {
      assetMap.get(key).subCount = asset.count;
    }
  });

  return [...assetMap.values()];
}
