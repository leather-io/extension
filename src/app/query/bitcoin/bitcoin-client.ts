import axios from 'axios';

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

export interface OrdiscanInscription {
  inscription_id: string;
  inscription_number: number;
  content_type: string;
  owner_address: string;
  owner_output: string;
  timestamp: string;
  content_url: string;
}

export interface UtxoWithDerivationPath extends UtxoResponseItem {
  derivationPath: string;
}

class BestinslotInscriptionsApi {
  private defaultOptions = {
    headers: {
      'x-api-key': `${process.env.BESTINSLOT_API_KEY}`,
    },
  };
  constructor(public configuration: Configuration) {}

  async getInscriptionsByTransactionId(id: string) {
    const resp = await axios.get<{ data: { inscription_id: string }[]; blockHeight: number }>(
      `https://api.bestinslot.xyz/v3/inscription/in_transaction?tx_id=${id}`,
      {
        ...this.defaultOptions,
      }
    );

    return resp.data;
  }
}

/**
 * @see https://ordiscan.com/docs/api#get-list-of-inscriptions
 */
export const MAX_ORDISCAN_INSCRIPTIONS_PER_REQUEST = 100;

class OrdiscanApi {
  private defaultOptions = {
    headers: {
      Authorization: `Bearer ${process.env.ORDISCAN_API_KEY}`,
    },
  };
  constructor(public configuration: Configuration) {}

  /**
   * @description Retrieve a list of inscriptions based on different filters. The max number of inscriptions returned per request is 100.
   * @see https://ordiscan.com/docs/api#get-list-of-inscriptions
   */
  async getInscriptionsByAddress({
    address,
    fromInscriptionNumber,
    sort = 'inscription_number_asc',
  }: {
    address: string;
    fromInscriptionNumber: number;
    sort?: 'inscription_number_asc' | 'inscription_number_desc';
  }) {
    const resp = await axios.get<OrdiscanInscription[]>(
      `https://ordiscan.com/v1/inscriptions?address=${address}&from=${fromInscriptionNumber}&sort=${sort}`,
      {
        ...this.defaultOptions,
      }
    );

    return resp.data;
  }
}

class AddressApi {
  constructor(public configuration: Configuration) {}

  async getTransactionsByAddress(address: string) {
    const resp = await axios.get(`${this.configuration.baseUrl}/address/${address}/txs`);
    return resp.data;
  }

  async getUtxosByAddress(address: string): Promise<UtxoResponseItem[]> {
    const resp = await axios.get<UtxoResponseItem[]>(
      `${this.configuration.baseUrl}/address/${address}/utxo`
    );
    return resp.data.sort((a, b) => a.vout - b.vout);
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

  async getFeeEstimatesFromBlockcypherApi(network: string): Promise<FeeResult> {
    const resp = await axios.get<FeeEstimateEarnApiResponse>(
      `https://api.blockcypher.com/v1/btc/${network}`
    );
    const { low_fee_per_kb, medium_fee_per_kb, high_fee_per_kb } = resp.data;
    // These fees are in satoshis per kb
    return {
      slow: low_fee_per_kb / 1000,
      medium: medium_fee_per_kb / 1000,
      fast: high_fee_per_kb / 1000,
    };
  }

  async getFeeEstimatesFromMempoolSpaceApi(): Promise<FeeResult> {
    const resp = await axios.get<FeeEstimateMempoolSpaceApiResponse>(
      `https://mempool.space/api/v1/fees/recommended`
    );
    const { fastestFee, halfHourFee, hourFee } = resp.data;
    return {
      slow: hourFee,
      medium: halfHourFee,
      fast: fastestFee,
    };
  }
}

class TransactionsApi {
  constructor(public configuration: Configuration) {}

  async getBitcoinTransaction(txid: string) {
    const resp = await axios.get(`${this.configuration.baseUrl}/tx/${txid}`);
    return resp.data;
  }

  async getBitcoinTransactionHex(txid: string) {
    const resp = await axios.get(`${this.configuration.baseUrl}/tx/${txid}/hex`, {
      responseType: 'text',
    });
    return resp.data;
  }

  async broadcastTransaction(tx: string) {
    // TODO: refactor to use `axios`
    // https://github.com/leather-wallet/extension/issues/4521
    // eslint-disable-next-line no-restricted-globals
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
  bestinslotInscriptionsApi: BestinslotInscriptionsApi;
  ordiscanApi: OrdiscanApi;

  constructor(basePath: string) {
    this.configuration = new Configuration(basePath);
    this.addressApi = new AddressApi(this.configuration);
    this.feeEstimatesApi = new FeeEstimatesApi(this.configuration);
    this.transactionsApi = new TransactionsApi(this.configuration);
    this.bestinslotInscriptionsApi = new BestinslotInscriptionsApi(this.configuration);
    this.ordiscanApi = new OrdiscanApi(this.configuration);
  }
}
