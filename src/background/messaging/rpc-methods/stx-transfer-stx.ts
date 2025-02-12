import { createUnsecuredToken } from 'jsontokens';

import { type RpcParams, type RpcRequest, stxTransferStx } from '@leather.io/rpc';
import { TransactionTypes } from '@leather.io/stacks';

import { RouteUrls } from '@shared/route-urls';

import { handleRpcMessage } from '../handle-rpc-message';
import {
  type RequestParams,
  getStxDefaultMessageParamsToTransactionRequest,
  validateRequestParams,
} from '../messaging-utils';

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

export async function rpcStxTransferStx(
  message: RpcRequest<typeof stxTransferStx>,
  port: chrome.runtime.Port
) {
  const { id: requestId, method, params } = message;
  validateRequestParams({
    id: requestId,
    method,
    params,
    port,
    schema: stxTransferStx.params,
  });
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
