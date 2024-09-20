import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import type { BitcoinTx, Blockchain } from '@leather.io/models';

export interface TransactionListBitcoinTx {
  blockchain: Extract<Blockchain, 'bitcoin'>;
  transaction: BitcoinTx;
}

export interface TransactionListStacksTx {
  blockchain: Extract<Blockchain, 'stacks'>;
  transaction: AddressTransactionWithTransfers;
}

export type TransactionListTxs = TransactionListBitcoinTx | TransactionListStacksTx;
