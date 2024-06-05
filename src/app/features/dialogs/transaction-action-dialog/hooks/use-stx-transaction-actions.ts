import { useEffect } from 'react';

import * as yup from 'yup';

import {
  useStacksRawTransaction,
  useStxAvailableUnlockedBalance,
  useTransactionById,
} from '@leather.io/query';

import { useRefreshAllAccountData } from '@app/common/hooks/account/use-refresh-all-account-data';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { useStacksBroadcastTransaction } from '@app/features/stacks-transaction-request/hooks/use-stacks-broadcast-transaction';
import { useToast } from '@app/features/toasts/use-toast';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useSubmittedTransactionsActions } from '@app/store/submitted-transactions/submitted-transactions.hooks';

export function useStxTransactionActions(
  txid: string | undefined,
  actionType: 'cancel' | 'increaseFee'
) {
  const { data: tx, isLoading: isLoadingTx } = useTransactionById(txid || '');
  const toast = useToast();
  const refreshAccountData = useRefreshAllAccountData();
  const stxAddress = useCurrentStacksAccountAddress();
  const availableUnlockedBalance = useStxAvailableUnlockedBalance(stxAddress);
  const submittedTransactionsActions = useSubmittedTransactionsActions();
  const { isLoadingRawTx, rawTx } = useStacksRawTransaction(txid || '');
  const { stacksBroadcastTransaction } = useStacksBroadcastTransaction({
    token: 'STX',
    isCancelTransaction: actionType === 'cancel',
    isIncreaseFeeTransaction: actionType === 'increaseFee',
  });

  useEffect(() => {
    if (tx && tx.tx_status !== 'pending') {
      toast.info('Your transaction went through!.');
    }
  }, [toast, tx, tx?.tx_status]);

  const validationSchema = yup.object({ fee: stxFeeValidator(availableUnlockedBalance) });

  return {
    tx,
    rawTx,
    isLoadingTx,
    isLoadingRawTx,
    refreshAccountData,
    submittedTransactionsActions,
    stacksBroadcastTransaction,
    availableUnlockedBalance,
    validationSchema,
  };
}
