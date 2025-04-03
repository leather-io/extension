import { createUnsecuredToken } from 'jsontokens';

import { type RpcParams, stxTransferStx } from '@leather.io/rpc';
import { TransactionTypes } from '@leather.io/stacks';

import { RouteUrls } from '@shared/route-urls';

import { handleRpcMessage } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';
import {
  type RequestParams,
  getStxDefaultMessageParamsToTransactionRequest,
  validateRequestParams,
} from '../rpc-request-utils';

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
  async (request, port) => {
    const { id: requestId, method, params } = request;
    const { status } = validateRequestParams({
      id: requestId,
      method,
      params,
      port,
      schema: stxTransferStx.params,
    });
    if (status === 'failure') return;
    const txRequest = getMessageParamsToTransactionRequest(params);
    const requestParams: RequestParams = [
      ['requestId', requestId],
      ['request', createUnsecuredToken(txRequest)],
    ];
    return handleRpcMessage({
      request,
      path: RouteUrls.RpcStxTransferStx,
      port,
      requestParams,
    });
  }
);
