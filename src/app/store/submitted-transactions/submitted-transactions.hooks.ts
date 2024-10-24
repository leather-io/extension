import { useCallback, useMemo } from 'react';

import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { useAppDispatch } from '@app/store';

import { submittedTransactionsActions } from './submitted-transactions.actions';
import { useSubmittedTransactions } from './submitted-transactions.selectors';
import { SubmittedTransaction } from './submitted-transactions.slice';

export function useUpdateSubmittedTransactions() {
  const submittedTransactions = useSubmittedTransactions();
  const submittedTransactionsActions = useSubmittedTransactionsActions();
  return useCallback(
    (data: MempoolTransaction[]) => {
      const pendingTxids = data.map(tx => tx.tx_id);
      submittedTransactions.map(tx => {
        if (pendingTxids.includes(safelyFormatHexTxid(tx.txid)))
          return submittedTransactionsActions.transactionEnteredMempool(tx.txid);
        return;
      });
    },
    [submittedTransactions, submittedTransactionsActions]
  );
}

function useSubmittedTransactionsActions() {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      newTransactionSubmitted({ rawTx, txid }: SubmittedTransaction) {
        return dispatch(submittedTransactionsActions.newTransactionSubmitted({ rawTx, txid }));
      },

      transactionEnteredMempool(txid: string) {
        return dispatch(submittedTransactionsActions.transactionEnteredMempool(txid));
      },

      transactionReplacedByFee(txid: string) {
        return dispatch(submittedTransactionsActions.transactionReplacedByFee(txid));
      },
    }),
    [dispatch]
  );
}
