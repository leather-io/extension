import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import type { BitcoinTx } from '@leather.io/models';

import type { SbtcDeposit } from '@app/query/sbtc/sbtc-deposits.query';

import type {
  TransactionListBitcoinTx,
  TransactionListSbtcDeposit,
  TransactionListStacksTx,
} from './components/transaction-list/transaction-list.model';

function createBitcoinTxTypeWrapper(tx: BitcoinTx): TransactionListBitcoinTx {
  return {
    blockchain: 'bitcoin',
    transaction: tx,
  };
}

function createStacksTxTypeWrapper(tx: AddressTransactionWithTransfers): TransactionListStacksTx {
  return {
    blockchain: 'stacks',
    transaction: tx,
  };
}

function createSbtcDepositTxTypeWrapper(deposit: SbtcDeposit): TransactionListSbtcDeposit {
  return {
    blockchain: 'bitcoin-stacks',
    deposit,
  };
}

export function convertBitcoinTxsToListType(txs?: BitcoinTx[]) {
  if (!txs) return [];
  const confirmedTxs = txs.filter(tx => tx.status.confirmed);
  return confirmedTxs.map(tx => createBitcoinTxTypeWrapper(tx));
}

export function convertStacksTxsToListType(txs?: AddressTransactionWithTransfers[]) {
  if (!txs) return [];
  return txs.map(tx => createStacksTxTypeWrapper(tx));
}

export function convertSbtcDepositToListType(deposits?: SbtcDeposit[]) {
  if (!deposits) return [];
  return deposits.map(deposit => createSbtcDepositTxTypeWrapper(deposit));
}
