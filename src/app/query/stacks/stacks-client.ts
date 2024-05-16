import { TokensApi } from '@hirosystems/token-metadata-api-client';
import {
  AccountsApi,
  BlocksApi,
  Configuration,
  type ConfigurationParameters,
  FaucetsApi,
  FeesApi,
  FungibleTokensApi,
  InfoApi,
  NamesApi,
  NonFungibleTokensApi,
  RosettaApi,
  SearchApi,
  SmartContractsApi,
  TransactionsApi,
} from '@stacks/blockchain-api-client';
import axios from 'axios';

import { STX20_API_BASE_URL_MAINNET } from '@shared/constants';

export interface Stx20Balance {
  ticker: string;
  balance: string;
  updateDate: string;
}

interface Stx20BalanceResponse {
  address: string;
  balances: Stx20Balance[];
}

class Stx20Api {
  url = STX20_API_BASE_URL_MAINNET;

  async getStx20Balances(address: string) {
    const resp = await axios.get<Stx20BalanceResponse>(`${this.url}/balance/${address}`);
    return resp.data.balances;
  }
}

export class StacksClient {
  configuration: Configuration;
  smartContractsApi: SmartContractsApi;
  accountsApi: AccountsApi;
  infoApi: InfoApi;
  transactionsApi: TransactionsApi;
  blocksApi: BlocksApi;
  faucetsApi: FaucetsApi;
  namesApi: NamesApi;
  feesApi: FeesApi;
  searchApi: SearchApi;
  rosettaApi: RosettaApi;
  fungibleTokensApi: FungibleTokensApi;
  nonFungibleTokensApi: NonFungibleTokensApi;
  tokensApi: TokensApi;
  stx20Api: Stx20Api;

  constructor(config: ConfigurationParameters) {
    this.configuration = new Configuration(config);
    this.smartContractsApi = new SmartContractsApi(this.configuration);
    this.accountsApi = new AccountsApi(this.configuration);
    this.infoApi = new InfoApi(this.configuration);
    this.transactionsApi = new TransactionsApi(this.configuration);
    this.blocksApi = new BlocksApi(this.configuration);
    this.faucetsApi = new FaucetsApi(this.configuration);
    this.namesApi = new NamesApi(this.configuration);
    this.feesApi = new FeesApi(this.configuration);
    this.searchApi = new SearchApi(this.configuration);
    this.rosettaApi = new RosettaApi(this.configuration);
    this.fungibleTokensApi = new FungibleTokensApi(this.configuration);
    this.nonFungibleTokensApi = new NonFungibleTokensApi(this.configuration);
    this.tokensApi = new TokensApi({ basePath: config.basePath });
    this.stx20Api = new Stx20Api();
  }
}
