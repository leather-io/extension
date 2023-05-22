import { Blockchain, Utxo } from 'dlc-lib';
import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';

class BitcoinBlockchainInterface implements Blockchain {
  private readonly _getTransaction: (txid: string) => Promise<string>;
  private readonly _sendRawTransaction: (txHex: string) => Promise<Response>;
  private readonly _getUtxosForAddress: (address: string) => Promise<UtxoResponseItem[]>;

  constructor(
    _getTransaction: (txid: string) => Promise<string>,
    _sendRawTransaction: (txHex: string) => Promise<Response>,
    _getUtxosForAddress: (address: string) => Promise<UtxoResponseItem[]>
  ) {
    this._getTransaction = _getTransaction;
    this._sendRawTransaction = _sendRawTransaction;
    this._getUtxosForAddress = _getUtxosForAddress;
  }

  formatUTXO(utxo: UtxoResponseItem, address: string): Utxo {
    return {
      txid: utxo.txid,
      vout: utxo.vout,
      amount: utxo.value,
      reserved: false,
      address: address,
      redeemScript: '',
      maxWitnessLength: 107,
    };
  }

  async getTransaction(txID: string): Promise<string> {
    const tx = await this._getTransaction(txID);
    return tx;
  }
  
  async sendRawTransaction(txHex: string): Promise<void> {
    const txResponse = await this._sendRawTransaction(txHex);
    console.log('txResponse', txResponse.text())
  }

  async getUtxosForAddress(address: string): Promise<Utxo[]> {
    const UTXOs = await this._getUtxosForAddress(address);
    const formattedUTXOs = UTXOs.map((utxo) => this.formatUTXO(utxo, address));
    return formattedUTXOs;
  }
}

export default BitcoinBlockchainInterface;
