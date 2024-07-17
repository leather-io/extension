import { useCallback } from 'react';

import type { StacksTransaction } from '@stacks/transactions';

import { safelyFormatHexTxid, stxToMicroStx } from '@leather.io/utils';

import { useStxTransactionActions } from './use-stx-transaction-actions';

export function useStxIncreaseFee(txid: string | undefined) {
  const {
    tx,
    rawTx,
    isLoadingTx,
    isLoadingRawTx,
    refreshAccountData,
    submittedTransactionsActions,
    stacksBroadcastTransaction,
    availableUnlockedBalance,
    validationSchema,
  } = useStxTransactionActions(txid, 'increaseFee');

  const onSubmit = useCallback(
    async (values: { fee: number }, rawTx?: StacksTransaction) => {
      if (!tx || !rawTx) return;
      rawTx.setFee(stxToMicroStx(values.fee).toString());
      const txid = tx.tx_id || safelyFormatHexTxid(rawTx.txid());
      await refreshAccountData();
      submittedTransactionsActions.transactionReplacedByFee(txid);
      await stacksBroadcastTransaction(rawTx);
    },
    [tx, refreshAccountData, submittedTransactionsActions, stacksBroadcastTransaction]
  );

  return {
    availableUnlockedBalance,
    isLoadingRawTx,
    isLoadingTx,
    onSubmit,
    rawTx,
    tx,
    validationSchema,
  };
}
