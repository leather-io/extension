import { serializeCV } from '@stacks/transactions';
import { createUnsecuredToken } from 'jsontokens';

import { type RpcParams, type RpcRequest, stxCallContract } from '@leather.io/rpc';
import { TransactionTypes, getStacksContractName } from '@leather.io/stacks';
import { isString } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { handleRpcMessage } from '../handle-rpc-message';
import {
  type RequestParams,
  getStxDefaultMessageParamsToTransactionRequest,
  validateRequestParams,
} from '../messaging-utils';

function getMessageParamsToTransactionRequest(params: RpcParams<typeof stxCallContract>) {
  const contractName = getStacksContractName(params.contract);
  const defaultParams = getStxDefaultMessageParamsToTransactionRequest(params);

  return {
    txType: TransactionTypes.ContractCall,
    contractAddress: params.contract.split('.')[0],
    contractName,
    functionArgs: (params.functionArgs ?? []).map(arg => (isString(arg) ? arg : serializeCV(arg))),
    functionName: params.functionName,
    ...defaultParams,
  };
}

export async function rpcStxCallContract(
  message: RpcRequest<typeof stxCallContract>,
  port: chrome.runtime.Port
) {
  const { id: requestId, method, params } = message;
  const { status } = validateRequestParams({
    id: requestId,
    method,
    params,
    port,
    schema: stxCallContract.params,
  });
  if (status === 'failure') return;
  const requestParams: RequestParams = [
    ['requestId', requestId],
    ['request', createUnsecuredToken(getMessageParamsToTransactionRequest(message.params))],
  ];
  return handleRpcMessage({
    method: message.method,
    path: RouteUrls.RpcStxCallContract,
    port,
    requestParams,
    requestId: message.id,
  });
}
