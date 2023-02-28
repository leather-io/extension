import mempoolJS from '@mempool/mempool.js';

type MempoolApiClient = ReturnType<typeof mempoolJS>['bitcoin'];

export type UtxoResponseItem = Awaited<
  ReturnType<MempoolApiClient['addresses']['getAddressTxsUtxo']>
>[number];

class AddressApi {
  constructor(public client: MempoolApiClient) {}

  async getTransactionsByAddress(address: string) {
    return this.client.addresses.getAddressTxs({ address });
  }

  async getUtxosByAddress(address: string) {
    return this.client.addresses.getAddressTxsUtxo({ address });
  }
}

class FeeEstimatesApi {
  constructor(public client: MempoolApiClient) {}

  async getFeeEstimatesFromMempoolSpaceApi() {
    return this.client.fees.getFeesRecommended();
  }
}

class TransactionsApi {
  constructor(public client: MempoolApiClient) {}

  async broadcastTransaction(txhex: string) {
    return this.client.transactions.postTx({ txhex });
  }
}

export class BitcoinClient {
  addressApi: AddressApi;
  feeEstimatesApi: FeeEstimatesApi;
  transactionsApi: TransactionsApi;
  mempoolJS: MempoolApiClient;

  constructor(network: 'mainnet' | 'testnet' | 'signet') {
    this.mempoolJS = mempoolJS({ network }).bitcoin;
    this.addressApi = new AddressApi(this.mempoolJS);
    this.feeEstimatesApi = new FeeEstimatesApi(this.mempoolJS);
    this.transactionsApi = new TransactionsApi(this.mempoolJS);
  }
}
