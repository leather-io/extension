import { ReactNode, useMemo } from 'react';

import { deserializeTransaction } from '@stacks/transactions';
import { Stack, Text, color } from '@stacks/ui';

import { SubmittedTransactionItem } from '@app/features/activity-list/components/submitted-transaction-list/submitted-transaction-item';
import { SubmittedTransaction } from '@app/store/submitted-transactions/submitted-transactions.slice';

type SubmittedTransactionListItemProps = SubmittedTransaction;

export const SubmittedTransactionListItem = ({
  rawTx,
  txId,
}: SubmittedTransactionListItemProps) => {
  const submittedTx = useMemo(() => deserializeTransaction(rawTx), [rawTx]);
  return <SubmittedTransactionItem transaction={submittedTx} txId={txId} />;
};

interface SubmittedTransactionListLayoutProps {
  children: ReactNode;
}
export const SubmittedTransactionListLayout = ({
  children,
}: SubmittedTransactionListLayoutProps) => {
  return (
    <>
      <Text textStyle="body.small" color={color('text-caption')}>
        Submitted
      </Text>
      <Stack mt="base-loose" pb="extra-loose" spacing="loose">
        {children}
      </Stack>
    </>
  );
};
