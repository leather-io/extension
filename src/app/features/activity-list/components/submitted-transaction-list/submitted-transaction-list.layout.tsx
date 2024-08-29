import { ReactNode, useMemo } from 'react';

import { deserializeTransaction } from '@stacks/transactions';
import { Stack, styled } from 'leather-styles/jsx';

import { SubmittedTransactionItem } from '@app/features/activity-list/components/submitted-transaction-list/submitted-transaction-item';
import { SubmittedTransaction } from '@app/store/submitted-transactions/submitted-transactions.slice';

type SubmittedTransactionListItemProps = SubmittedTransaction;

export function SubmittedTransactionListItem({ rawTx, txid }: SubmittedTransactionListItemProps) {
  const submittedTx = useMemo(() => deserializeTransaction(rawTx), [rawTx]);
  return <SubmittedTransactionItem transaction={submittedTx} txid={txid} />;
}

interface SubmittedTransactionListLayoutProps {
  children: ReactNode;
}
export function SubmittedTransactionListLayout({ children }: SubmittedTransactionListLayoutProps) {
  return (
    <>
      <styled.span textStyle="body.02" color="ink.text-subdued">
        Submitted
      </styled.span>
      <Stack pb="space.06" gap="space.05">
        {children}
      </Stack>
    </>
  );
}
