import { createUnsecuredToken } from 'jsontokens';

import { type RpcParams, stxTransferStx } from '@leather.io/rpc';
import { TransactionTypes } from '@leather.io/stacks';

import { RouteUrls } from '@shared/route-urls';

import {
  type RequestParams,
  getStxDefaultMessageParamsToTransactionRequest,
  validateRequestParams,
} from '../messaging-utils';
import { handleRpcMessage } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';

function getMessageParamsToTransactionRequest(params: RpcParams<typeof stxTransferStx>) {
  const defaultParams = getStxDefaultMessageParamsToTransactionRequest(params);

  return {
    txType: TransactionTypes.StxTokenTransfer,
    amount: params.amount.toString(),
    memo: params.memo ?? '', // Add default to type,
    recipient: params.recipient,
    ...defaultParams,
  };
}

export const stxTransferStxHandler = defineRpcRequestHandler(
  stxTransferStx.method,
  async (message, port) => {
    const { id: requestId, method, params } = message;
    const { status } = validateRequestParams({
      id: requestId,
      method,
      params,
      port,
      schema: stxTransferStx.params,
    });
    if (status === 'failure') return;
    const request = getMessageParamsToTransactionRequest(params);
    const requestParams: RequestParams = [
      ['requestId', requestId],
      ['request', createUnsecuredToken(request)],
    ];
    return handleRpcMessage({
      method: message.method,
      path: RouteUrls.RpcStxTransferStx,
      port,
      requestParams,
      requestId: message.id,
    });
  }
);
