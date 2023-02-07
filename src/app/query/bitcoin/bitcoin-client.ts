import { fetchBitcoinData } from './utils';

class Configuration {
  constructor(public baseUrl: string) {}
}

interface UtxoResponseItem {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
  value: number;
}

class AddressApi {
  constructor(public configuration: Configuration) {}

  async getTransactionsByAddress(address: string) {
    return fetchBitcoinData({
      errorMsg: 'No transactions fetched',
      url: `${this.configuration.baseUrl}/address/${address}/txs`,
    });
  }

  async getUtxosByAddress(address: string): Promise<UtxoResponseItem[]> {
    return fetchBitcoinData({
      errorMsg: 'No UTXOs fetched',
      url: `${this.configuration.baseUrl}/address/${address}/utxo`,
    });
  }
}

class FeeEstimatesApi {
  constructor(public configuration: Configuration) {}

  async getFeeEstimates() {
    return fetchBitcoinData({
      errorMsg: 'No fee estimates fetched',
      url: `${this.configuration.baseUrl}/fee-estimates`,
    });
  }
}

class TransactionsApi {
  constructor(public configuration: Configuration) {}

  async broadcastTransaction(tx: string) {
    return fetch(`${this.configuration.baseUrl}/tx`, {
      method: 'POST',
      body: tx,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }
}

export class BitcoinClient {
  configuration: Configuration;
  addressApi: AddressApi;
  feeEstimatesApi: FeeEstimatesApi;
  transactionsApi: TransactionsApi;

  constructor(basePath: string) {
    this.configuration = new Configuration(basePath);
    this.addressApi = new AddressApi(this.configuration);
    this.feeEstimatesApi = new FeeEstimatesApi(this.configuration);
    this.transactionsApi = new TransactionsApi(this.configuration);
  }
}
