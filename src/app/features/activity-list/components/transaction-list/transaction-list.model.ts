import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import type { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';
import type { Blockchains } from '@shared/models/blockchain.model';

export interface TransactionListBitcoinTx {
  blockchain: Extract<Blockchains, 'bitcoin'>;
  transaction: BitcoinTransaction;
}

export interface TransactionListStacksTx {
  blockchain: Extract<Blockchains, 'stacks'>;
  transaction: AddressTransactionWithTransfers;
}

export type TransactionListTxs = TransactionListBitcoinTx | TransactionListStacksTx;
