import { ClarityVersion } from '@stacks/transactions';
import { createUnsecuredToken } from 'jsontokens';

import { type RpcParams, type RpcRequest, stxDeployContract } from '@leather.io/rpc';
import { TransactionTypes } from '@leather.io/stacks';

import { RouteUrls } from '@shared/route-urls';

import { handleRpcMessage } from '../handle-rpc-message';
import {
  RequestParams,
  getStxDefaultMessageParamsToTransactionRequest,
  validateRequestParams,
} from '../messaging-utils';

function getMessageParamsToTransactionRequest(params: RpcParams<typeof stxDeployContract>) {
  const defaultParams = getStxDefaultMessageParamsToTransactionRequest(params);

  return {
    txType: TransactionTypes.ContractDeploy,
    contractName: params.name,
    codeBody: params.clarityCode,
    clarityVersion: params.clarityVersion ?? ClarityVersion.Clarity3,
    ...defaultParams,
  };
}

export async function rpcStxDeployContract(
  message: RpcRequest<typeof stxDeployContract>,
  port: chrome.runtime.Port
) {
  const { id: requestId, method, params } = message;
  const { status } = validateRequestParams({
    id: requestId,
    method,
    params,
    port,
    schema: stxDeployContract.params,
  });
  if (status === 'failure') return;
  const request = getMessageParamsToTransactionRequest(params);
  const requestParams: RequestParams = [
    ['requestId', requestId],
    ['request', createUnsecuredToken(request)],
  ];
  return handleRpcMessage({
    method: message.method,
    path: RouteUrls.RpcStxDeployContract,
    port,
    requestParams,
    requestId: message.id,
  });
}
