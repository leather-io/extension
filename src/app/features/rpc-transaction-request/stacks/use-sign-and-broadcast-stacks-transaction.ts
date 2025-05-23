import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import type { StacksTransactionWire, TxBroadcastResultRejected } from '@stacks/transactions';

import { type RpcMethodNames, createRpcSuccessResponse } from '@leather.io/rpc';
import { delay, isString } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';

import { getErrorMessage } from '@app/common/get-error-message';
import { useRpcRequestParams } from '@app/common/hooks/use-rpc-request-params';
import { stacksBroadcastTransaction } from '@app/common/transactions/stacks/stacks-broadcast-transaction';
import { useToast } from '@app/features/toasts/use-toast';
import { useCurrentStacksNetworkState } from '@app/store/networks/networks.hooks';
import { useSignStacksTransaction } from '@app/store/transactions/transaction.hooks';

import { useRpcTransactionRequest } from '../use-rpc-transaction-request';

export function useSignAndBroadcastStacksTransaction(method: RpcMethodNames) {
  const { onSetTransactionStatus } = useRpcTransactionRequest();
  const { tabId, requestId } = useRpcRequestParams();
  const signStacksTransaction = useSignStacksTransaction();
  const network = useCurrentStacksNetworkState();
  const navigate = useNavigate();
  const toast = useToast();

  return useCallback(
    async (unsignedTx: StacksTransactionWire) => {
      const signedTx = await signStacksTransaction(unsignedTx);
      if (!signedTx) return logger.error('No signed stacks transaction to broadcast');

      function onError(error: Error | string, reason?: TxBroadcastResultRejected['reason']) {
        const message = isString(error) ? error : error.message;
        if (reason) toast.error(getErrorMessage(reason));
        navigate(RouteUrls.BroadcastError, { state: { message } });
      }

      function onSuccess(txid: string, transaction: StacksTransactionWire) {
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
      }
      onSetTransactionStatus('broadcasting');
      await stacksBroadcastTransaction({ network, signedTx, onError, onSuccess });
      onSetTransactionStatus('idle');
      await delay(500);
      closeWindow();
    },
    [
      method,
      navigate,
      network,
      onSetTransactionStatus,
      requestId,
      signStacksTransaction,
      tabId,
      toast,
    ]
  );
}
