import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import type { BitcoinTx } from '@leather.io/models';

import { BitcoinTransactionItem } from '@app/components/bitcoin-transaction-item/bitcoin-transaction-item';
import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';

import { PendingTransactionListLayout } from './pending-transaction-list.layout';

interface PendingTransactionListProps {
  bitcoinTxs: BitcoinTx[];
  stacksTxs: MempoolTransaction[];
}
export function PendingTransactionList({ bitcoinTxs, stacksTxs }: PendingTransactionListProps) {
  return (
    <PendingTransactionListLayout>
      {bitcoinTxs.map(tx => (
        <BitcoinTransactionItem key={tx.txid} transaction={tx} />
      ))}
      {stacksTxs.map(tx => (
        <StacksTransactionItem key={tx.tx_id} transaction={tx} />
      ))}
    </PendingTransactionListLayout>
  );
}
