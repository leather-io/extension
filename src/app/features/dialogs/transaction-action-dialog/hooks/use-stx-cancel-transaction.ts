import { useCallback } from 'react';

import { TransactionTypes } from '@stacks/connect';

import { stxToMicroStx } from '@leather.io/utils';

import {
  type GenerateUnsignedTransactionOptions,
  generateUnsignedTransaction,
} from '@app/common/transactions/stacks/generate-unsigned-txs';
import { getBurnAddress } from '@app/common/utils/get-burn-address';
import { safelyFormatHexTxid } from '@app/common/utils/safe-handle-txid';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';

import { useStxTransactionActions } from './use-stx-transaction-actions';

export function useStxCancelTransaction(txid: string | undefined) {
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
  } = useStxTransactionActions(txid, 'cancel');

  const network = useCurrentStacksNetworkState();
  const account = useCurrentStacksAccount();

  const onSubmit = useCallback(
    async (values: { fee: number }) => {
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
      account,
      network,
      refreshAccountData,
      submittedTransactionsActions,
      stacksBroadcastTransaction,
    ]
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
