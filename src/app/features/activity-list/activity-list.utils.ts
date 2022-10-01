import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { WalletBlockchains } from '@shared/models/blockchain.model';
import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

import {
  TransactionListBitcoinTx,
  TransactionListStacksTx,
} from './components/transaction-list/transaction-list.model';

function createBitcoinTxTypeWrapper(tx: BitcoinTransaction): TransactionListBitcoinTx {
  return {
    blockchain: WalletBlockchains.bitcoin,
    transaction: tx,
  };
}

function createStacksTxTypeWrapper(tx: AddressTransactionWithTransfers): TransactionListStacksTx {
  return {
    blockchain: WalletBlockchains.stacks,
    transaction: tx,
  };
}

export function convertBitcoinTxsToListType(txs?: BitcoinTransaction[]) {
  if (!txs) return [];
  const confirmedTxs = txs.filter(tx => tx.status.confirmed);
  return confirmedTxs.map(tx => createBitcoinTxTypeWrapper(tx));
}

export function convertStacksTxsToListType(txs?: AddressTransactionWithTransfers[]) {
  if (!txs) return [];
  return txs.map(tx => createStacksTxTypeWrapper(tx));
}
