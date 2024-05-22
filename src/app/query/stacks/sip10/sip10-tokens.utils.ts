import type { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';
import type { CryptoAssetBalance, Sip10CryptoAssetInfo } from '@leather-wallet/models';

import { isUndefined } from '@shared/utils';

import { getTicker } from '@app/common/utils';
import type { SwapAsset } from '@app/query/common/alex-sdk/alex-sdk.hooks';
import { getAssetStringParts } from '@app/ui/utils/get-asset-string-parts';

export function isTransferableSip10Token(token: Partial<FtMetadataResponse>) {
  return !isUndefined(token.decimals) && !isUndefined(token.name) && !isUndefined(token.symbol);
}

export function createSip10CryptoAssetInfo(
  contractId: string,
  key: string,
  ftAsset: FtMetadataResponse
): Sip10CryptoAssetInfo {
  const { assetName, contractName, address } = getAssetStringParts(key);
  const tokenName = ftAsset.name ? ftAsset.name : assetName;

  return {
    canTransfer: isTransferableSip10Token(ftAsset),
    contractAddress: address,
    contractAssetName: assetName,
    contractId,
    contractName,
    decimals: ftAsset.decimals ?? 0,
    hasMemo: isTransferableSip10Token(ftAsset),
    imageCanonicalUri: ftAsset.image_canonical_uri ?? '',
    tokenName,
    symbol: ftAsset.symbol ?? getTicker(tokenName),
  };
}

export type Sip10CryptoAssetFilter = 'all' | 'supported' | 'unsupported';

export function filterSip10Tokens(
  swapAssets: SwapAsset[],
  tokens: {
    balance: CryptoAssetBalance;
    info: Sip10CryptoAssetInfo;
  }[],
  filter: Sip10CryptoAssetFilter
) {
  return tokens.filter(token => {
    if (filter === 'supported') {
      return swapAssets.some(swapAsset => swapAsset.principal === token.info.contractId);
    }
    if (filter === 'unsupported') {
      return !swapAssets.some(swapAsset => swapAsset.principal === token.info.contractId);
    }
    return true;
  });
}
