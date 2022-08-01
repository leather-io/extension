import { useMemo } from 'react';

import { useAppDispatch } from '@app/store';

import { submittedTransactionsActions } from './submitted-transactions.actions';
import { SubmittedTransaction } from './submitted-transactions.slice';

export function useSubmittedTransactionsActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      newTransactionSubmitted({ rawTx, txId }: SubmittedTransaction) {
        return dispatch(submittedTransactionsActions.newTransactionSubmitted({ rawTx, txId }));
      },

      transactionEnteredMempool(txId: string) {
        return dispatch(submittedTransactionsActions.transactionEnteredMempool(txId));
      },

      transactionReplacedByFee(txId: string) {
        return dispatch(submittedTransactionsActions.transactionReplacedByFee(txId));
      },
    }),
    [dispatch]
  );
}
