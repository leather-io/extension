import type { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';

import type { CryptoAssetBalance, Sip10CryptoAssetInfo } from '@leather-wallet/models';
import { isUndefined } from '@leather-wallet/utils';

import { getStacksContractIdStringParts } from '@app/common/stacks-utils';
import { getPrincipalFromContractId, getTicker } from '@app/common/utils';
import type { SwapAsset } from '@app/query/common/alex-sdk/alex-sdk.hooks';

export function isTransferableSip10Token(token: Partial<FtMetadataResponse>) {
  return !isUndefined(token.decimals) && !isUndefined(token.name) && !isUndefined(token.symbol);
}

export function createSip10CryptoAssetInfo(
  key: string,
  ftAsset: FtMetadataResponse
): Sip10CryptoAssetInfo {
  const { contractAssetName } = getStacksContractIdStringParts(key);
  const name = ftAsset.name || contractAssetName;

  return {
    canTransfer: isTransferableSip10Token(ftAsset),
    contractId: key,
    decimals: ftAsset.decimals ?? 0,
    hasMemo: isTransferableSip10Token(ftAsset),
    imageCanonicalUri: ftAsset.image_canonical_uri ?? '',
    name,
    symbol: ftAsset.symbol || getTicker(name),
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
    const principal = getPrincipalFromContractId(token.info.contractId);
    if (filter === 'supported') {
      return swapAssets.some(swapAsset => swapAsset.principal === principal);
    }
    if (filter === 'unsupported') {
      return !swapAssets.some(swapAsset => swapAsset.principal === principal);
    }
    return true;
  });
}
