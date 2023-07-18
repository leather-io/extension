import {
  FtMetadataResponse,
  NftMetadataResponse,
  NotFoundErrorResponse,
} from '@hirosystems/token-metadata-api-client';

export type FtAssetResponse = FtMetadataResponse | NotFoundErrorResponse;
export type NftAssetResponse = NftMetadataResponse | NotFoundErrorResponse;

function isAssetMetadataNotFoundResponse(
  resp: FtAssetResponse | NftAssetResponse
): resp is NotFoundErrorResponse {
  return 'error' in resp;
}

export function isFtAsset(resp: FtAssetResponse): resp is FtMetadataResponse {
  return !isAssetMetadataNotFoundResponse(resp);
}

export function isNftAsset(resp: NftAssetResponse): resp is NftMetadataResponse {
  return !isAssetMetadataNotFoundResponse(resp);
}
