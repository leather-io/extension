import axios from 'axios';
import PQueue from 'p-queue';

import {
  BESTINSLOT_API_BASE_URL_MAINNET,
  BESTINSLOT_API_BASE_URL_TESTNET,
  type BitcoinNetworkModes,
} from '@shared/constants';
import type { MarketData } from '@shared/models/market.model';
import type { Money } from '@shared/models/money.model';
import type { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { getBlockstreamRatelimiter } from './blockstream-rate-limiter';

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

export interface UtxoWithDerivationPath extends UtxoResponseItem {
  derivationPath: string;
}

interface BestinslotInscription {
  inscription_name: string | null;
  inscription_id: string;
  inscription_number: number;
  metadata: any | null;
  wallet: string;
  mime_type: string;
  media_length: number;
  genesis_ts: number;
  genesis_height: number;
  genesis_fee: number;
  output_value: number;
  satpoint: string;
  collection_name: string | null;
  collection_slug: string | null;
  last_transfer_block_height: number;
  content_url: string;
  bis_url: string;
  byte_size: number;
}

interface BestinslotInscriptionByIdResponse {
  data: BestinslotInscription;
  block_height: number;
}

interface BestinslotInscriptionsByTxIdResponse {
  data: { inscription_id: string }[];
  blockHeight: number;
}

/* BRC-20 */
interface Brc20Balance {
  ticker: string;
  overall_balance: string;
  available_balance: string;
  transferrable_balance: string;
  image_url: string | null;
  min_listed_unit_price: number | null;
}

interface Brc20TickerInfo {
  id: string;
  number: number;
  block_height: number;
  tx_id: string;
  address: string;
  ticker: string;
  max_supply: string;
  mint_limit: string;
  decimals: number;
  deploy_timestamp: number;
  minted_supply: string;
  tx_count: number;
}

interface Brc20TickerInfoResponse {
  block_height: number;
  data: Brc20TickerInfo;
}

interface Brc20WalletBalancesResponse {
  block_height: number;
  data: Brc20Balance[];
}

export interface Brc20Token {
  balance: Money | null;
  holderAddress: string;
  marketData: MarketData | null;
  tokenData: Brc20Balance & Brc20TickerInfo;
}

/* RUNES */
export interface RuneBalance {
  pkscript: string;
  rune_id: string;
  rune_name: string;
  spaced_rune_name: string;
  total_balance: string;
  wallet_addr: string;
}

interface RunesWalletBalancesResponse {
  block_height: number;
  data: RuneBalance[];
}

export interface RuneTickerInfo {
  rune_id: string;
  rune_number: string;
  rune_name: string;
  spaced_rune_name: string;
  symbol: string;
  decimals: number;
  per_mint_amount: string;
  mint_cnt: string;
  mint_cnt_limit: string;
  premined_supply: string;
  total_minted_supply: string;
  burned_supply: string;
  circulating_supply: string;
  mint_progress: number;
  mint_start_block: number | null;
  mint_end_block: number | null;
  genesis_block: number;
  deploy_ts: string;
  deploy_txid: string;
  auto_upgrade: boolean;
  holder_count: number;
  event_count: number;
  mintable: boolean;
}
interface RunesTickerInfoResponse {
  block_height: number;
  data: RuneTickerInfo;
}

export interface RuneToken {
  balance: Money;
  tokenData: RuneBalance & RuneTickerInfo;
}

export interface RunesOutputsByAddress {
  pkscript: string;
  wallet_addr: string;
  output: string;
  rune_ids: string[];
  balances: number[];
  rune_names: string[];
  spaced_rune_names: string[];
}

interface RunesOutputsByAddressArgs {
  address: string;
  network?: BitcoinNetworkModes;
  sortBy?: 'output';
  order?: 'asc' | 'desc';
  offset?: number;
  count?: number;
  signal?: AbortSignal;
}

interface RunesOutputsByAddressResponse {
  block_height: number;
  data: RunesOutputsByAddress[];
}

class BestinSlotApi {
  url = BESTINSLOT_API_BASE_URL_MAINNET;
  testnetUrl = BESTINSLOT_API_BASE_URL_TESTNET;

  private defaultOptions = {
    headers: {
      'x-api-key': `${process.env.BESTINSLOT_API_KEY}`,
    },
  };
  constructor(public configuration: Configuration) {}

  async getInscriptionsByTransactionId(id: string) {
    const resp = await axios.get<BestinslotInscriptionsByTxIdResponse>(
      `${this.url}/inscription/in_transaction?tx_id=${id}`,
      {
        ...this.defaultOptions,
      }
    );

    return resp.data;
  }

  async getInscriptionById(id: string) {
    const resp = await axios.get<BestinslotInscriptionByIdResponse>(
      `${this.url}/inscription/single_info_id?inscription_id=${id}`,
      {
        ...this.defaultOptions,
      }
    );
    return resp.data;
  }

  /* BRC-20 */
  async getBrc20Balances(address: string) {
    const resp = await axios.get<Brc20WalletBalancesResponse>(
      `${this.url}/brc20/wallet_balances?address=${address}`,
      {
        ...this.defaultOptions,
      }
    );
    return resp.data;
  }

  async getBrc20TickerInfo(ticker: string) {
    const resp = await axios.get<Brc20TickerInfoResponse>(
      `${this.url}/brc20/ticker_info?ticker=${ticker}`,
      {
        ...this.defaultOptions,
      }
    );
    return resp.data;
  }

  /* RUNES */
  async getRunesWalletBalances(address: string, network: BitcoinNetworkModes) {
    const baseUrl = network === 'mainnet' ? this.url : this.testnetUrl;
    const resp = await axios.get<RunesWalletBalancesResponse>(
      `${baseUrl}/runes/wallet_balances?address=${address}`,
      { ...this.defaultOptions }
    );
    return resp.data.data;
  }

  async getRunesTickerInfo(runeName: string, network: BitcoinNetworkModes) {
    const baseUrl = network === 'mainnet' ? this.url : this.testnetUrl;
    const resp = await axios.get<RunesTickerInfoResponse>(
      `${baseUrl}/runes/ticker_info?rune_name=${runeName}`,
      { ...this.defaultOptions }
    );
    return resp.data.data;
  }

  async getRunesBatchOutputsInfo(outputs: string[], network: BitcoinNetworkModes) {
    const baseUrl = network === 'mainnet' ? this.url : this.testnetUrl;

    const resp = await axios.post<RunesOutputsByAddressResponse>(
      `${baseUrl}/runes/batch_output_info`,
      { queries: outputs },
      { ...this.defaultOptions }
    );
    return resp.data.data;
  }

  /**
   * @see https://docs.bestinslot.xyz/reference/api-reference/ordinals-and-brc-20-and-runes-and-bitmap-v3-api-mainnet+testnet/runes#runes-wallet-valid-outputs
   */
  async getRunesOutputsByAddress({
    address,
    network = 'mainnet',
    sortBy = 'output',
    order = 'asc',
    offset = 0,
    count = 100,
    signal,
  }: RunesOutputsByAddressArgs) {
    const baseUrl = network === 'mainnet' ? this.url : this.testnetUrl;
    const queryParams = new URLSearchParams({
      address,
      sort_by: sortBy,
      order,
      offset: offset.toString(),
      count: count.toString(),
    });

    const resp = await axios.get<RunesOutputsByAddressResponse>(
      `${baseUrl}/runes/wallet_valid_outputs?${queryParams}`,
      { ...this.defaultOptions, signal }
    );
    return resp.data.data;
  }
}

class AddressApi {
  rateLimiter: PQueue;
  constructor(public configuration: Configuration) {
    this.rateLimiter = getBlockstreamRatelimiter(this.configuration.baseUrl);
  }

  async getTransactionsByAddress(address: string, signal?: AbortSignal) {
    const resp = await this.rateLimiter.add(
      () =>
        axios.get<BitcoinTx[]>(`${this.configuration.baseUrl}/address/${address}/txs`, {
          signal,
        }),
      { signal, throwOnTimeout: true }
    );
    return resp.data;
  }

  async getUtxosByAddress(address: string, signal?: AbortSignal): Promise<UtxoResponseItem[]> {
    const resp = await this.rateLimiter.add(
      () =>
        axios.get<UtxoResponseItem[]>(`${this.configuration.baseUrl}/address/${address}/utxo`, {
          signal,
        }),
      { signal, priority: 1, throwOnTimeout: true }
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

  async getFeeEstimatesFromBlockcypherApi(network: 'main' | 'test3'): Promise<FeeResult> {
    // https://www.blockcypher.com/dev/bitcoin/#restful-resources
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
  bestinSlotApi: BestinSlotApi;

  constructor(baseUrl: string) {
    this.configuration = new Configuration(baseUrl);
    this.addressApi = new AddressApi(this.configuration);
    this.feeEstimatesApi = new FeeEstimatesApi(this.configuration);
    this.transactionsApi = new TransactionsApi(this.configuration);
    this.bestinSlotApi = new BestinSlotApi(this.configuration);
  }
}
