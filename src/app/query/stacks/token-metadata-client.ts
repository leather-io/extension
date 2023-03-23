import {
  Configuration,
  ConfigurationParameters,
  TokensApi,
} from '@hirosystems/token-metadata-api-client';

export class TokenMetadataClient {
  configuration: Configuration;
  tokensApi: TokensApi;

  constructor(config: ConfigurationParameters) {
    this.configuration = new Configuration(config);
    this.tokensApi = new TokensApi(this.configuration);
  }
}
