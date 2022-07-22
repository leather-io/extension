import { ReactNode, useMemo } from 'react';
import { deserializeTransaction } from '@stacks/transactions';
import { color, Stack, Text } from '@stacks/ui';

import { SubmittedTransactionsItem } from '@app/features/activity-list/components/submitted-transactions-item';
import { SubmittedTransaction } from '@app/store/submitted-transactions/submitted-transactions.slice';

type SubmittedTransactionsListItemProps = SubmittedTransaction;

export const SubmittedTransactionsListItem = ({
  rawTx,
  txId,
}: SubmittedTransactionsListItemProps) => {
  const submittedTx = useMemo(() => deserializeTransaction(rawTx), [rawTx]);
  return <SubmittedTransactionsItem transaction={submittedTx} txId={txId} />;
};

interface SubmittedTransactionsListLayoutProps {
  children: ReactNode;
}
export const SubmittedTransactionsListLayout = ({
  children,
}: SubmittedTransactionsListLayoutProps) => {
  return (
    <Stack pb="extra-loose" spacing="extra-loose">
      <Text textStyle="body.small" color={color('text-caption')}>
        Submitted
      </Text>
      {children}
      <Stack mt="base-loose" spacing="loose"></Stack>
    </Stack>
  );
};
