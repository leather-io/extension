import { useMemo } from 'react';

import { MultiSigSpendingCondition, deserializeTransaction } from '@stacks/transactions';

import { createRpcSuccessResponse } from '@leather.io/rpc';

import { closeWindow } from '@shared/utils';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { initialSearchParams } from '@app/common/initial-search-params';
import { getTxSenderAddress } from '@app/common/transactions/stacks/transaction.utils';
import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';

function useRpcStxSignTransactionParams() {
  const { origin, tabId } = useDefaultRequestParams();
  const requestId = initialSearchParams.get('requestId');
  const txHex = initialSearchParams.get('txHex');
  const isMultisig = initialSearchParams.get('isMultisig');

  if (!requestId || !txHex || !origin) throw new Error('Invalid params');

  return useMemo(
    () => ({
      origin,
      tabId: tabId ?? 0,
      requestId,
      isMultisig: isMultisig === 'true',
      stacksTransaction: deserializeTransaction(txHex),
      txSender: getTxSenderAddress(deserializeTransaction(txHex)) ?? '',
    }),
    [origin, txHex, requestId, isMultisig, tabId]
  );
}

export function useRpcStxSignTransaction() {
  const { origin, requestId, tabId, stacksTransaction, isMultisig, txSender } =
    useRpcStxSignTransactionParams();
  const signStacksTx = useSignStacksTransaction();
  const wasSignedByOtherOwners =
    isMultisig &&
    (stacksTransaction.auth.spendingCondition as MultiSigSpendingCondition).fields?.length > 0;

  return {
    origin,
    disableFeeSelection: wasSignedByOtherOwners,
    disableNonceSelection: wasSignedByOtherOwners,
    stacksTransaction,
    isMultisig,
    txSender,
    async onSignStacksTransaction(fee: number, nonce: number) {
      stacksTransaction.setFee(fee);
      stacksTransaction.setNonce(nonce);

      const signedTransaction = await signStacksTx(stacksTransaction);

      if (!signedTransaction) throw new Error('Error signing stacks transaction');

      chrome.tabs.sendMessage(
        tabId,
        createRpcSuccessResponse('stx_signTransaction', {
          id: requestId,
          result: {
            txHex: signedTransaction.serialize(),
            transaction: signedTransaction.serialize(),
          },
        })
      );
      closeWindow();
    },
  };
}
