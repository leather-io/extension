import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import type { BitcoinTx } from '@leather.io/models';

import type { SbtcDeposit } from '@app/query/sbtc/sbtc-deposits.query';

export interface TransactionListBitcoinTx {
  blockchain: 'bitcoin';
  transaction: BitcoinTx;
}

export interface TransactionListStacksTx {
  blockchain: 'stacks';
  transaction: AddressTransactionWithTransfers;
}

export interface TransactionListSbtcDeposit {
  blockchain: 'bitcoin-stacks';
  deposit: SbtcDeposit;
}

export type TransactionListTxs =
  | TransactionListBitcoinTx
  | TransactionListStacksTx
  | TransactionListSbtcDeposit;
