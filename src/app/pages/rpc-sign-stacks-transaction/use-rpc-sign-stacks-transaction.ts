import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { RpcErrorCode } from '@btckit/types';
import { bytesToHex } from '@stacks/common';
import { MultiSigSpendingCondition, deserializeTransaction } from '@stacks/transactions';

import { makeRpcErrorResponse, makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';
import { closeWindow } from '@shared/utils';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { useRejectIfLedgerWallet } from '@app/common/rpc-helpers';
import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';

function useRpcSignStacksTransactionParams() {
  useRejectIfLedgerWallet('stx_signTransaction');

  const [searchParams] = useSearchParams();
  const { origin, tabId } = useDefaultRequestParams();
  const requestId = searchParams.get('requestId');
  const txHex = searchParams.get('txHex');
  const isMultisig = searchParams.get('isMultisig');

  if (!requestId || !txHex || !origin) throw new Error('Invalid params');

  return useMemo(
    () => ({
      origin,
      tabId: tabId ?? 0,
      requestId,
      isMultisig: isMultisig === 'true',
      stacksTransaction: deserializeTransaction(txHex),
    }),
    [origin, txHex, requestId, isMultisig, tabId]
  );
}

export function useRpcSignStacksTransaction() {
  const { origin, requestId, tabId, stacksTransaction, isMultisig } =
    useRpcSignStacksTransactionParams();
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
    async onSignStacksTransaction(fee: number, nonce: number) {
      stacksTransaction.setFee(fee);
      stacksTransaction.setNonce(nonce);

      const signedTransaction = await signStacksTx(stacksTransaction);
      if (!signedTransaction) {
        throw new Error('Error signing stacks transaction');
      }

      chrome.tabs.sendMessage(
        tabId,
        makeRpcSuccessResponse('stx_signTransaction', {
          id: requestId,
          result: {
            txHex: bytesToHex(signedTransaction.serialize()),
          },
        })
      );
      closeWindow();
    },
    onCancel() {
      chrome.tabs.sendMessage(
        tabId,
        makeRpcErrorResponse('stx_signTransaction', {
          id: requestId,
          error: {
            message: 'User denied signing stacks transaction',
            code: RpcErrorCode.USER_REJECTION,
          },
        })
      );
    },
  };
}
