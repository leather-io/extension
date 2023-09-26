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

export interface NativeSegwitUtxo extends UtxoResponseItem {
  addressIndex: number;
}

export interface TaprootUtxo extends UtxoResponseItem {
  addressIndex: number;
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
    }).then((utxos: UtxoResponseItem[]) =>
      // Sort by vout as blockstream API returns them inconsistently
      utxos.sort((a, b) => a.vout - b.vout)
    );
  }
}

interface FeeEstimateEarnApiResponse {
  name: string;
  height: number;
  hash: string;
  time: string;
  latest_url: string;
  previous_hash: string;
  previous_url: string;
  peer_count: number;
  unconfirmed_count: number;
  high_fee_per_kb: number;
  medium_fee_per_kb: number;
  low_fee_per_kb: number;
  last_fork_height: number;
  last_fork_hash: string;
}
interface FeeEstimateMempoolSpaceApiResponse {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

interface FeeResult {
  fast: number;
  medium: number;
  slow: number;
}

class FeeEstimatesApi {
  constructor(public configuration: Configuration) {}

  async getFeeEstimatesFromBlockcypherApi(): Promise<FeeResult> {
    return fetchData({
      errorMsg: 'No fee estimates fetched',
      url: `https://api.blockcypher.com/v1/btc/main`,
    }).then((resp: FeeEstimateEarnApiResponse) => {
      const { low_fee_per_kb, medium_fee_per_kb, high_fee_per_kb } = resp;
      // These fees are in satoshis per kb
      return {
        slow: low_fee_per_kb / 1000,
        medium: medium_fee_per_kb / 1000,
        fast: high_fee_per_kb / 1000,
      };
    });
  }

  async getFeeEstimatesFromMempoolSpaceApi(): Promise<FeeResult> {
    return fetchData({
      errorMsg: 'No fee estimates fetched',
      url: ` https://mempool.space/api/v1/fees/recommended`,
    }).then((resp: FeeEstimateMempoolSpaceApiResponse) => {
      const { fastestFee, halfHourFee, hourFee } = resp;
      return {
        slow: hourFee,
        medium: halfHourFee,
        fast: fastestFee,
      };
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
