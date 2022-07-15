import { useCallback, useEffect, useMemo } from 'react';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';

import { deserializeTransaction } from '@stacks/transactions';

import { accountSubmittedTransactionsState, SubmittedTransaction } from './submitted-transactions';
import { useCurrentAccountTxIds } from '@app/query/transactions/transaction.hooks';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';

export function useAccountSubmittedTransactionsState() {
  return useAtomValue(accountSubmittedTransactionsState);
}

function useSetAccountSubmittedTransactionsState() {
  return useUpdateAtom(accountSubmittedTransactionsState);
}

export function useAddSubmittedTransactionCallback() {
  const submittedTxs = useAccountSubmittedTransactionsState();
  const setSubmittedTxs = useSetAccountSubmittedTransactionsState();
  return useCallback(
    ({ rawTx, txid }: SubmittedTransaction) => {
      setSubmittedTxs([{ rawTx, txid }, ...submittedTxs]);
    },
    [setSubmittedTxs, submittedTxs]
  );
}

export function useRemoveSubmittedTransactionCallback() {
  const submittedTxs = useAccountSubmittedTransactionsState();
  const setSubmittedTxs = useSetAccountSubmittedTransactionsState();
  return useCallback(
    (txid: string) => {
      const updatedSubmittedTxs = submittedTxs.filter(tx => tx.txid !== txid);
      setSubmittedTxs([...updatedSubmittedTxs]);
    },
    [setSubmittedTxs, submittedTxs]
  );
}

export function useAccountSubmittedStacksTransactions() {
  const submittedTxs = useAccountSubmittedTransactionsState();
  return useMemo(() => submittedTxs.map(tx => deserializeTransaction(tx.rawTx)), [submittedTxs]);
}

export function useSubmittedStacksTransaction(txid: string) {
  const submittedTxs = useAccountSubmittedTransactionsState();
  const submittedTx = submittedTxs.find(tx => tx.txid === txid);
  return useMemo(() => {
    if (!submittedTx) return;
    return deserializeTransaction(submittedTx.rawTx);
  }, [submittedTx]);
}

export function useCleanupSubmittedTransactions() {
  const submittedTxs = useAccountSubmittedTransactionsState();
  const accountTxIds = useCurrentAccountTxIds();
  const removeSubmittedTransaction = useRemoveSubmittedTransactionCallback();

  return useEffect(() => {
    submittedTxs.map(tx => {
      if (accountTxIds.includes(safelyFormatHexTxid(tx.txid))) removeSubmittedTransaction(tx.txid);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountTxIds, submittedTxs]);
}
