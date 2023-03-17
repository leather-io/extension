import {
  FtMetadataResponse,
  NftMetadataResponse,
  TokenNotFoundResponse,
} from '@hirosystems/token-metadata-api-client';

export type FtAssetResponse = FtMetadataResponse | TokenNotFoundResponse;
export type NftAssetResponse = NftMetadataResponse | TokenNotFoundResponse;

function isAssetMetadataNotFoundResponse(
  resp: FtAssetResponse | NftAssetResponse
): resp is TokenNotFoundResponse {
  return 'error' in resp;
}

export function isFtAsset(resp: FtAssetResponse): resp is FtMetadataResponse {
  return !isAssetMetadataNotFoundResponse(resp);
}

export function isNftAsset(resp: NftAssetResponse): resp is NftMetadataResponse {
  return !isAssetMetadataNotFoundResponse(resp);
}
