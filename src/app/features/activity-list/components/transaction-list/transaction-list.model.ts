import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import type { Blockchains } from '@shared/models/blockchain.model';
import type { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

export interface TransactionListBitcoinTx {
  blockchain: Extract<Blockchains, 'bitcoin'>;
  transaction: BitcoinTx;
}

export interface TransactionListStacksTx {
  blockchain: Extract<Blockchains, 'stacks'>;
  transaction: AddressTransactionWithTransfers;
}

export type TransactionListTxs = TransactionListBitcoinTx | TransactionListStacksTx;
