import { useAsync } from 'react-async-hook';

import { RpcErrorCode, type RpcMethodNames, createRpcErrorResponse } from '@leather.io/rpc';
import {
  type StacksUnsignedTransactionOptions,
  generateStacksUnsignedTransaction,
} from '@leather.io/stacks';

import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';

import type { RpcTransactionRequest } from '../use-rpc-transaction-request';

interface UseUnsignedStacksTransactionForFeeEstimationArgs {
  method: RpcMethodNames;
  request: RpcTransactionRequest;
  txOptions: StacksUnsignedTransactionOptions;
}
export function useUnsignedStacksTransactionForFeeEstimation({
  method,
  request,
  txOptions,
}: UseUnsignedStacksTransactionForFeeEstimationArgs) {
  const unsignedTx = useAsync(
    async () => await generateStacksUnsignedTransaction(txOptions),
    [txOptions]
  );
  if (unsignedTx.error) {
    chrome.tabs.sendMessage(
      request.tabId,
      createRpcErrorResponse(method, {
        id: request.requestId,
        error: {
          code: RpcErrorCode.INVALID_REQUEST,
          message: RpcErrorMessage.UndefinedTransaction,
        },
      })
    );
    throw new Error('Error generating unsigned stacks transaction');
  }
  return unsignedTx.result;
}
