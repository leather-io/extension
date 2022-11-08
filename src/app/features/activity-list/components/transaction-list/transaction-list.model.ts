import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import type { Blockchains } from '@shared/models/blockchain.model';
import type { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

export interface TransactionListBitcoinTx {
  blockchain: Extract<Blockchains, 'bitcoin'>;
  transaction: BitcoinTransaction;
}

export interface TransactionListStacksTx {
  blockchain: Extract<Blockchains, 'stacks'>;
  transaction: AddressTransactionWithTransfers;
}

export type TransactionListTxs = TransactionListBitcoinTx | TransactionListStacksTx;
