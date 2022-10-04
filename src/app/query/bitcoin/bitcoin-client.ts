import { fetchBitcoinData } from './utils';

class Configuration {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
}

class AddressApi {
  configuration: Configuration;

  constructor(configuration: Configuration) {
    this.configuration = configuration;
  }

  async getTransactionsByAddress(address: string) {
    return fetchBitcoinData({
      errorMsg: 'No transactions fetched',
      url: `${this.configuration.baseUrl}/address/${address}/txs`,
    });
  }

  async getUtxosByAddress(address: string) {
    return fetchBitcoinData({
      errorMsg: 'No UTXOs fetched',
      url: `${this.configuration.baseUrl}/address/${address}/utxo`,
    });
  }
}

export class BitcoinClient {
  configuration: Configuration;
  addressApi: AddressApi;

  constructor(basePath: string) {
    this.configuration = new Configuration(basePath);
    this.addressApi = new AddressApi(this.configuration);
  }
}
