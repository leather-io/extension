import {
  AccountsApi,
  BlocksApi,
  Configuration,
  ConfigurationParameters,
  FaucetsApi,
  FeesApi,
  FungibleTokensApi,
  InfoApi,
  MicroblocksApi,
  NamesApi,
  NonFungibleTokensApi,
  RosettaApi,
  SearchApi,
  SmartContractsApi,
  TransactionsApi,
} from '@stacks/blockchain-api-client';

export class StacksClient {
  configuration: Configuration;
  smartContractsApi: SmartContractsApi;
  accountsApi: AccountsApi;
  infoApi: InfoApi;
  transactionsApi: TransactionsApi;
  microblocksApi: MicroblocksApi;
  blocksApi: BlocksApi;
  faucetsApi: FaucetsApi;
  namesApi: NamesApi;
  feesApi: FeesApi;
  searchApi: SearchApi;
  rosettaApi: RosettaApi;
  fungibleTokensApi: FungibleTokensApi;
  nonFungibleTokensApi: NonFungibleTokensApi;

  constructor(config: ConfigurationParameters) {
    this.configuration = new Configuration(config);
    this.smartContractsApi = new SmartContractsApi(this.configuration);
    this.accountsApi = new AccountsApi(this.configuration);
    this.infoApi = new InfoApi(this.configuration);
    this.transactionsApi = new TransactionsApi(this.configuration);
    this.microblocksApi = new MicroblocksApi(this.configuration);
    this.blocksApi = new BlocksApi(this.configuration);
    this.faucetsApi = new FaucetsApi(this.configuration);
    this.namesApi = new NamesApi(this.configuration);
    this.feesApi = new FeesApi(this.configuration);
    this.searchApi = new SearchApi(this.configuration);
    this.rosettaApi = new RosettaApi(this.configuration);
    this.fungibleTokensApi = new FungibleTokensApi(this.configuration);
    this.nonFungibleTokensApi = new NonFungibleTokensApi(this.configuration);
  }
}
