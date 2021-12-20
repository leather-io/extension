import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

export type Tx = MempoolTransaction | Transaction;

export type Status = 'success_microblock' | 'success_anchor_block' | 'pending' | 'failed';

export const statusFromTx = (tx: Tx): Status => {
  const { tx_status } = tx;
  if (tx_status === 'pending') return 'pending';
  if (tx_status === 'success')
    return 'is_unanchored' in tx && tx.is_unanchored
      ? 'success_microblock'
      : 'success_anchor_block';
  return 'failed';
};
