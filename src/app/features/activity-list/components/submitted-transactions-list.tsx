import { color, Stack, Text } from '@stacks/ui';

import { SubmittedTransactionsItem } from '@app/features/activity-list/components/submitted-transactions-item';
import { useSubmittedStacksTransaction } from '@app/store/accounts/submitted-transactions.hooks';
import { SubmittedTransaction } from '@app/store/accounts/submitted-transactions';

const SubmittedTransactionsListItem = ({ txid }: { txid: string }) => {
  const submittedTx = useSubmittedStacksTransaction(txid);
  if (submittedTx) return <SubmittedTransactionsItem transaction={submittedTx} txid={txid} />;
  return <>Loading...</>;
};

interface SubmittedTransactionsListProps {
  txs: SubmittedTransaction[];
}
export const SubmittedTransactionsList = ({ txs }: SubmittedTransactionsListProps) => {
  return (
    <Stack pb="extra-loose" spacing="extra-loose">
      <Text textStyle="body.small" color={color('text-caption')}>
        Submitted
      </Text>
      <Stack mt="base-loose" spacing="loose">
        {txs.map(tx => (
          <SubmittedTransactionsListItem key={tx.txid} txid={tx.txid} />
        ))}
      </Stack>
    </Stack>
  );
};
