import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { WalletBlockchains } from '@shared/models/blockchain.model';
import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

export interface TransactionListBitcoinTx {
  blockchain: WalletBlockchains.bitcoin;
  transaction: BitcoinTransaction;
}

export interface TransactionListStacksTx {
  blockchain: WalletBlockchains.stacks;
  transaction: AddressTransactionWithTransfers;
}

export type TransactionListTxs = TransactionListBitcoinTx | TransactionListStacksTx;
