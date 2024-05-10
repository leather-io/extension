import type { SwapAsset } from '@app/query/common/alex-sdk/alex-sdk.hooks';
import type { Sip10AccountCryptoAssetWithDetails } from '@app/query/models/crypto-asset.model';
import { getAssetStringParts } from '@app/ui/utils/get-asset-string-parts';

export type Sip10CryptoAssetFilter = 'all' | 'supported' | 'unsupported';

export function filterSip10AccountCryptoAssetsWithDetails(
  assets: Sip10AccountCryptoAssetWithDetails[],
  swapAssets: SwapAsset[],
  filter: Sip10CryptoAssetFilter
) {
  return assets.filter(asset => {
    const { address: contractAddress } = getAssetStringParts(asset.info.contractId);
    if (filter === 'supported') {
      return swapAssets.some(swapAsset => swapAsset.principal.includes(contractAddress));
    }
    if (filter === 'unsupported') {
      return !swapAssets.some(swapAsset => swapAsset.principal.includes(contractAddress));
    }
    return assets;
  });
}
