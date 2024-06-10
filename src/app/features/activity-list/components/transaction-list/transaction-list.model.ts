import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import type { BitcoinTx } from '@leather-wallet/models';

import type { Blockchains } from '@shared/models/blockchain.model';

export interface TransactionListBitcoinTx {
  blockchain: Extract<Blockchains, 'bitcoin'>;
  transaction: BitcoinTx;
}

export interface TransactionListStacksTx {
  blockchain: Extract<Blockchains, 'stacks'>;
  transaction: AddressTransactionWithTransfers;
}

export type TransactionListTxs = TransactionListBitcoinTx | TransactionListStacksTx;
