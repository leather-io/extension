import { serializeCV } from '@stacks/transactions';
import { createUnsecuredToken } from 'jsontokens';

import { type RpcParams, stxCallContract } from '@leather.io/rpc';
import { TransactionTypes, getStacksContractName } from '@leather.io/stacks';
import { isString } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import {
  type RequestParams,
  getStxDefaultMessageParamsToTransactionRequest,
  validateRequestParams,
} from '../messaging-utils';
import { handleRpcMessage } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';

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
export const stxCallContractHandler = defineRpcRequestHandler(
  stxCallContract.method,
  async (message, port) => {
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
    if (params.network) requestParams.push(['network', params.network]);

    return handleRpcMessage({
      method: message.method,
      path: RouteUrls.RpcStxCallContract,
      port,
      requestParams,
      requestId: message.id,
    });
  }
);
