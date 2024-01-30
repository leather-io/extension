import { Configuration as TokenMetadataConfiguration } from '@hirosystems/token-metadata-api-client';
import { Configuration } from '@stacks/blockchain-api-client';

import { wrappedFetch as fetchApi } from '@app/common/api/fetch-wrapper';

export function createStacksClientConfig(basePath: string) {
  return new Configuration({
    basePath,
    fetchApi,
  });
}

export function createTokenMetadataConfig(basePath: string) {
  return new TokenMetadataConfiguration({ basePath });
}
