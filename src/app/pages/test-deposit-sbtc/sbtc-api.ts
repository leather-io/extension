/* eslint-disable */
import * as btc from '@scure/btc-signer';
import { TransactionInput } from '@scure/btc-signer/psbt';
import {
  type NetworkClientParam,
  STACKS_TESTNET,
  clientFromNetwork,
  networkFrom,
} from '@stacks/network';
import {
  Cl,
  type ClarityType,
  ClarityValue,
  SomeCV,
  UIntCV,
  cvToHex,
  cvToValue,
  hexToCV,
} from '@stacks/transactions';
import { REGTEST } from 'sbtc';

import type { sbtcDepositHelper } from './deposit';

export const READONLY_FUNCTION_CALL_PATH = '/v2/contracts/call-read';

export interface BufferCV {
  readonly type: ClarityType.Buffer;
  readonly value: string;
}
// interface BufferCV {
//   readonly type: ClarityType.Buffer;
//   readonly buffer: Uint8Array;
// }

/**
 * Read only function response object
 *
 * @param {Boolean} okay - the status of the response
 * @param {string} result - serialized hex clarity value
 */
export interface ReadOnlyFunctionSuccessResponse {
  okay: true;
  result: string;
}

export interface ReadOnlyFunctionErrorResponse {
  okay: false;
  cause: string;
}

export type ReadOnlyFunctionResponse =
  | ReadOnlyFunctionSuccessResponse
  | ReadOnlyFunctionErrorResponse;

/**
 * Converts the response of a read-only function call into its Clarity Value
 * @param param
 */
export const parseReadOnlyResponse = (response: ReadOnlyFunctionResponse): ClarityValue => {
  if (response.okay) {
    console.log('parse', hexToCV(response.result));
    return hexToCV(response.result);
  }
  throw new Error(response.cause);
};

export async function fetchCallReadOnlyFunction({
  contractName,
  contractAddress,
  functionName,
  functionArgs,
  senderAddress,
  network = 'mainnet',
  client: _client,
}: {
  contractName: string;
  contractAddress: string;
  functionName: string;
  functionArgs: ClarityValue[];
  /** address of the sender */
  senderAddress: string;
} & NetworkClientParam): Promise<ClarityValue> {
  const json = {
    sender: senderAddress,
    arguments: functionArgs.map(arg => cvToHex(arg)),
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  };

  const name = encodeURIComponent(functionName);

  const client = Object.assign({}, clientFromNetwork(networkFrom(network)), _client);
  const url = `${client.baseUrl}${READONLY_FUNCTION_CALL_PATH}/${contractAddress}/${contractName}/${name}`;
  const response = await client.fetch(url, options);

  if (!response.ok) {
    const msg = await response.text().catch(() => '');
    throw new Error(
      `Error calling read-only function. Response ${response.status}: ${response.statusText}. Attempted to fetch ${url} and failed with the message: "${msg}"`
    );
  }

  return await response.json().then(parseReadOnlyResponse);
}

type LazyLoadable<T extends object, K extends string> = T & Record<K, any>;

/** @internal */
export function wrapLazyProxy<
  T extends {
    [key: string]: any;
  },
  K extends string,
  R,
>(target: T, key: K, resolution: () => R | Promise<R>): LazyLoadable<T, K> {
  return new Proxy(target, {
    get(obj, prop: string) {
      if (prop === key && obj[prop] === undefined) {
        (obj as any)[prop] = Promise.resolve(resolution()).catch(error => {
          delete obj[prop];
          throw error;
        });
      }
      return obj[prop];
    },
    has(obj, prop) {
      if (prop === key) return true;
      return prop in obj;
    },
  });
}

/** todo */
// https://blockstream.info/api/address/1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY/utxo
// [{"txid":"033e44b535c5709d30234921608219ee5ca1e320fa9def44715eaeb2b7ad52d3","vout":0,"status":{"confirmed":false},"value":42200}]
export type MempoolApiUtxo = {
  txid: string;
  vout: number;
  value: number;
  status?: {
    confirmed: boolean;
    block_height: number;
  };
};

/** todo */
export type UtxoWithTx = MempoolApiUtxo & {
  tx: string | Promise<string>;
};

export type SpendableUtxo = MempoolApiUtxo & {
  input: TransactionInput | Promise<TransactionInput>;
  vsize?: number | Promise<number>;
};

export type MempoolFeeEstimates = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  // economyFee: number;
  // minimumFee: number;
};

export interface BaseClientConfig {
  sbtcContract: string;

  sbtcApiUrl: string;
  btcApiUrl: string;
  stxApiUrl: string;
}

export class SbtcApiClient {
  constructor(public config: BaseClientConfig) {}

  async fetchUtxos(address: string): Promise<UtxoWithTx[]> {
    return (
      fetch(`${this.config.btcApiUrl}/address/${address}/utxo`)
        .then(res => res.json())
        // .then((utxos: MempoolApiUtxo[]) =>
        //   utxos.sort((a, b) => a.status.block_height - b.status.block_height)
        // )
        .then((utxos: MempoolApiUtxo[]) =>
          utxos.map(u => wrapLazyProxy(u, 'tx', () => this.fetchTxHex(u.txid)))
        )
    );
  }

  async fetchTxHex(txid: string): Promise<string> {
    return fetch(`${this.config.btcApiUrl}/tx/${txid}/hex`).then(res => res.text());
  }

  async fetchFeeRates(): Promise<MempoolFeeEstimates> {
    return fetch(`${this.config.btcApiUrl}/api/v1/fees/recommended`).then(res => res.json());
  }

  async fetchFeeRate(target: 'low' | 'medium' | 'high'): Promise<number> {
    const feeEstimates = await this.fetchFeeRates();
    const t = target === 'high' ? 'fastestFee' : target === 'medium' ? 'halfHourFee' : 'hourFee';
    return feeEstimates[t];
  }

  async broadcastTx(tx: btc.Transaction): Promise<string> {
    return await fetch(`${this.config.btcApiUrl}/tx`, {
      method: 'POST',
      body: tx.hex,
    }).then(res => res.text());
  }

  async notifySbtc(depositInfo: Awaited<ReturnType<typeof sbtcDepositHelper>>) {
    return (await fetch(`${this.config.sbtcApiUrl}/deposit`, {
      method: 'POST',
      body: JSON.stringify({
        bitcoinTxid: depositInfo.transaction.id,
        bitcoinTxOutputIndex: 0,
        depositScript: depositInfo.depositScript,
        reclaimScript: depositInfo.reclaimScript,
      }),
    }).then(res => res.json())) as {
      bitcoinTxid: string;
      bitcoinTxOutputIndex: number;
      recipient: string;
      amount: number;
      lastUpdateHeight: number;
      lastUpdateBlockHash: string;
      status: string;
      statusMessage: string;
      parameters: {
        maxFee: number;
        lockTime: number;
      };
      reclaimScript: string;
      depositScript: string;
    };
  }

  async fetchSignersPublicKey(contractAddress?: string): Promise<string> {
    const res = await fetchCallReadOnlyFunction({
      contractAddress: contractAddress ?? this.config.sbtcContract,
      contractName: 'sbtc-registry',
      functionName: 'get-current-aggregate-pubkey',
      functionArgs: [],
      senderAddress: STACKS_TESTNET.bootAddress, // zero address
      client: {
        baseUrl: this.config.stxApiUrl,
      },
    });

    return cvToValue(res).slice(2);
  }

  async fetchSignersAddress(contractAddress?: string): Promise<string> {
    const pub = await this.fetchSignersPublicKey(contractAddress ?? this.config.sbtcContract);
    return btc.p2tr(pub, undefined, REGTEST).address!;
  }

  async fetchCallReadOnly({
    contractAddress,
    functionName,
    args = [],
    sender = STACKS_TESTNET.bootAddress, // zero address
  }: {
    contractAddress: string;
    functionName: string;
    args?: ClarityValue[];
    sender?: string;
  }) {
    contractAddress = contractAddress.replace('.', '/');
    return await fetch(
      `${this.config.stxApiUrl}/v2/contracts/call-read/${contractAddress}/${encodeURIComponent(
        functionName
      )}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender, arguments: args.map(Cl.serialize) }),
      }
    )
      .then(res => res.json())
      .then(res => Cl.deserialize(res.result));
  }

  /** Get BTC balance (in satoshis) */
  async fetchBalance(address: string): Promise<number> {
    // todo: check if better endpoints now exist
    const addressInfo = await fetch(`${this.config.btcApiUrl}/address/${address}`).then(r =>
      r.json()
    );

    return addressInfo.chain_stats.funded_txo_sum - addressInfo.chain_stats.spent_txo_sum;
  }

  async fetchSbtcBalance(stacksAddress: string) {
    const balance = (await this.fetchCallReadOnly({
      contractAddress: this.config.sbtcContract,
      functionName: 'get-balance',
      args: [Cl.address(stacksAddress)],
    })) as SomeCV<UIntCV>;

    return balance?.value?.value ?? 0;
  }
}
/** todo */
export class SbtcApiClientTestnet extends SbtcApiClient {
  constructor(config?: Partial<BaseClientConfig>) {
    super(
      Object.assign(
        {
          sbtcApiUrl: 'https://beta.sbtc-emily.com', // todo: get real url
          btcApiUrl: 'https://beta.sbtc-mempool.tech/api/proxy', // todo: replace with functioning regtest testnet deployment
          stxApiUrl: 'https://api.testnet.hiro.so',
          /** ⚠︎ Attention: This contract address might still change over the course of the sBTC contract on Testnet */
          sbtcContract: 'SNGWPN3XDAQE673MXYXF81016M50NHF5X5PWWM70',
        },
        config
      )
    );
  }
}
