import { useCallback } from 'react';

import { stxToMicroStx } from '@leather-wallet/utils';
import { TransactionTypes } from '@stacks/connect';
import * as yup from 'yup';

import { useRefreshAllAccountData } from '@app/common/hooks/account/use-refresh-all-account-data';
import {
  type GenerateUnsignedTransactionOptions,
  generateUnsignedTransaction,
} from '@app/common/transactions/stacks/generate-unsigned-txs';
import { getBurnAddress } from '@app/common/utils/get-burn-address';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { useStacksBroadcastTransaction } from '@app/features/stacks-transaction-request/hooks/use-stacks-broadcast-transaction';
import { useCurrentStxAvailableUnlockedBalance } from '@app/query/stacks/balance/account-balance.hooks';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';
import { useSubmittedTransactionsActions } from '@app/store/submitted-transactions/submitted-transactions.hooks';
import { useRawDeserializedTxState, useRawTxIdState } from '@app/store/transactions/raw.hooks';

import { useSelectedTx } from './use-selected-tx';

export function useStxCancelTransaction() {
  const [rawTxId, setRawTxId] = useRawTxIdState();
  const tx = useSelectedTx();
  const [, setTxId] = useRawTxIdState();
  const availableUnlockedBalance = useCurrentStxAvailableUnlockedBalance();
  const submittedTransactionsActions = useSubmittedTransactionsActions();
  const rawTx = useRawDeserializedTxState();
  const { data: stxFees } = useCalculateStacksTxFees(rawTx);
  const network = useCurrentStacksNetworkState();
  const account = useCurrentStacksAccount();
  const refreshAccountData = useRefreshAllAccountData();

  const { stacksBroadcastTransaction } = useStacksBroadcastTransaction({
    token: 'STX',
    isCancelTransaction: true,
  });

  const fee = Number(rawTx?.auth.spendingCondition?.fee);

  const onSubmit = useCallback(
    async (values: any) => {
      if (!tx || !rawTx || !account) return;

      const options: GenerateUnsignedTransactionOptions = {
        publicKey: account.stxPublicKey,
        nonce: tx.nonce,
        fee: stxToMicroStx(values?.fee || 0).toNumber(),
        txData: {
          txType: TransactionTypes.STXTransfer,
          recipient: getBurnAddress(network),
          amount: 1,
          memo: '_cancel transaction',
          network: network,
        } as any,
      };
      const newTx = await generateUnsignedTransaction(options);
      const txId = tx.tx_id || safelyFormatHexTxid(rawTx.txid());
      await refreshAccountData();
      submittedTransactionsActions.transactionReplacedByFee(txId);
      await stacksBroadcastTransaction(newTx);
    },
    [
      tx,
      rawTx,
      refreshAccountData,
      submittedTransactionsActions,
      stacksBroadcastTransaction,
      account,
      network,
    ]
  );

  return {
    availableUnlockedBalance,
    stxFees,
    fee,
    rawTx,
    rawTxId,
    setRawTxId,
    tx,
    setTxId,
    onSubmit,
    validationSchema: yup.object({ fee: stxFeeValidator(availableUnlockedBalance) }),
  };
}
