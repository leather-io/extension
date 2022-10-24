import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { StacksTransactionItem } from '@app/components/stacks-transaction-item/stacks-transaction-item';
import { BitcoinTransaction } from '@shared/models/transactions/bitcoin-transaction.model';

import { PendingTransactionListLayout } from './pending-transaction-list.layout';
import { BitcoinTransactionItem } from '../transaction-list/bitcoin-transaction/bitcoin-transaction-item';

interface PendingTransactionListProps {
  bitcoinTxs: BitcoinTransaction[];
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
