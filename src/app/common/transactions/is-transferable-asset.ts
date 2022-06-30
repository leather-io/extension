import { isUndefined } from '@shared/utils';
import { AssetWithMeta } from '../asset-types';

export function isTransferableAsset(asset: AssetWithMeta) {
  if (asset.type === 'stx') return true;
  if (asset.type === 'ft') {
    return asset.meta
      ? !isUndefined(asset.meta.decimals) &&
          !isUndefined(asset.meta.name) &&
          !isUndefined(asset.meta.symbol)
      : false;
  }
  return false;
}
