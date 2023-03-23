import { fetchData } from '../utils';

class Configuration {
  constructor(public baseUrl: string) {}
}

export interface UtxoResponseItem {
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
    return fetchData({
      errorMsg: 'No transactions fetched',
      url: `${this.configuration.baseUrl}/address/${address}/txs`,
    });
  }

  async getUtxosByAddress(address: string): Promise<UtxoResponseItem[]> {
    return fetchData({
      errorMsg: 'No UTXOs fetched',
      url: `${this.configuration.baseUrl}/address/${address}/utxo`,
    });
  }
}

interface FeeEstimateEarnApiResponse {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
}
export interface FeeEstimateMempoolSpaceApi {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}
class FeeEstimatesApi {
  constructor(public configuration: Configuration) {}

  async getFeeEstimatesFromEarnApi(): Promise<FeeEstimateEarnApiResponse> {
    return fetchData({
      errorMsg: 'No fee estimates fetched',
      url: `https://bitcoinfees.earn.com/api/v1/fees/recommended`,
    });
  }

  async getFeeEstimatesFromMempoolSpaceApi(): Promise<FeeEstimateMempoolSpaceApi> {
    return fetchData({
      errorMsg: 'No fee estimates fetched',
      url: ` https://mempool.space/api/v1/fees/recommended`,
    });
  }
}

class TransactionsApi {
  constructor(public configuration: Configuration) {}

  async getBitcoinTransaction(txid: string) {
    return fetch(`${this.configuration.baseUrl}/tx/${txid}`).then(res => res.json());
  }

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
