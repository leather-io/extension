import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { AuthType, type StacksTransactionWire } from '@stacks/transactions';

import {
  RpcErrorCode,
  type RpcMethodNames,
  createRpcErrorResponse,
  createRpcSuccessResponse,
} from '@leather.io/rpc';
import { delay, isString } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';
import { closeWindow } from '@shared/utils';

import { useRpcRequestParams } from '@app/common/hooks/use-rpc-request-params';
import { stacksBroadcastTransaction } from '@app/common/transactions/stacks/stacks-broadcast-transaction';
import { createError } from '@app/common/utils';
import { useAnalyticsOnlyStacksNonceTracker } from '@app/components/loaders/stacks-nonce-loader';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';
import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';

import { useRpcTransactionRequest } from '../use-rpc-transaction-request';

export function useSignAndBroadcastStacksTransaction(method: RpcMethodNames) {
  const { onSetTransactionStatus } = useRpcTransactionRequest();
  const { tabId, requestId } = useRpcRequestParams();
  const signStacksTransaction = useSignStacksTransaction();
  const network = useCurrentStacksNetworkState();
  const navigate = useNavigate();
  const { trackIfNonceError } = useAnalyticsOnlyStacksNonceTracker();

  return useCallback(
    async (unsignedTx: StacksTransactionWire) => {
      const signedTx = await signStacksTransaction(unsignedTx);

      if (!signedTx) {
        chrome.tabs.sendMessage(
          tabId,
          createRpcErrorResponse(method, {
            id: requestId,
            error: {
              code: RpcErrorCode.INVALID_REQUEST,
              message: RpcErrorMessage.UnsignedTransaction,
            },
          })
        );
        throw createError({
          name: 'TransactionReturnedFromSignerNull',
          message: 'Unable to sign transaction',
        });
      }

      // If the transaction is sponsored, we do not broadcast it
      const isSponsored = signedTx.auth?.authType === AuthType.Sponsored;
      if (isSponsored) {
        chrome.tabs.sendMessage(
          tabId,
          createRpcSuccessResponse(method, {
            id: requestId,
            result: {
              txid: '',
              transaction: signedTx.serialize(),
            },
          })
        );
        await delay(500);
        closeWindow();
      }

      function onError(error: Error | string) {
        const message = isString(error) ? error : error.message;
        trackIfNonceError(unsignedTx, error);

        return navigate(RouteUrls.BroadcastError, { state: { message } });
      }

      async function onSuccess(txid: string, transaction: StacksTransactionWire) {
        onSetTransactionStatus('submitted');

        chrome.tabs.sendMessage(
          tabId,
          createRpcSuccessResponse(method, {
            id: requestId,
            result: {
              txid,
              transaction: transaction.serialize(),
            },
          })
        );
        await delay(250);
        closeWindow();
      }

      onSetTransactionStatus('broadcasting');
      await stacksBroadcastTransaction({ network, signedTx, onError, onSuccess });
      onSetTransactionStatus('idle');
    },
    [
      method,
      navigate,
      network,
      onSetTransactionStatus,
      requestId,
      signStacksTransaction,
      tabId,
      trackIfNonceError,
    ]
  );
}
