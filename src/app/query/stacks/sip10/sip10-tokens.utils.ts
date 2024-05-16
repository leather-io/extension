import type { CryptoAssetBalance, MarketData, Sip10CryptoAssetInfo } from '@leather-wallet/models';

import type { SwapAsset } from '@app/query/common/alex-sdk/alex-sdk.hooks';
import { getAssetStringParts } from '@app/ui/utils/get-asset-string-parts';

export type Sip10CryptoAssetFilter = 'all' | 'supported' | 'unsupported';

export function filterSip10Tokens(
  swapAssets: SwapAsset[],
  tokens: {
    assetInfo: Sip10CryptoAssetInfo;
    balance: CryptoAssetBalance;
    marketData: MarketData;
  }[],
  filter: Sip10CryptoAssetFilter
) {
  return tokens.filter(token => {
    const { address: contractAddress } = getAssetStringParts(token.assetInfo.contractId);
    if (filter === 'supported') {
      return swapAssets.some(swapAsset => swapAsset.principal.includes(contractAddress));
    }
    if (filter === 'unsupported') {
      return !swapAssets.some(swapAsset => swapAsset.principal.includes(contractAddress));
    }
    return tokens;
  });
}
