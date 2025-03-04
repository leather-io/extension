import { ClarityVersion } from '@stacks/transactions';
import { createUnsecuredToken } from 'jsontokens';

import { type RpcParams, stxDeployContract } from '@leather.io/rpc';
import { TransactionTypes } from '@leather.io/stacks';

import { RouteUrls } from '@shared/route-urls';

import {
  RequestParams,
  getStxDefaultMessageParamsToTransactionRequest,
  validateRequestParams,
} from '../messaging-utils';
import { handleRpcMessage } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';

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
export const stxDeployContractHandler = defineRpcRequestHandler(
  stxDeployContract.method,
  async (message, port) => {
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
    if (params.network) requestParams.push(['network', params.network]);
    return handleRpcMessage({
      method: message.method,
      path: RouteUrls.RpcStxDeployContract,
      port,
      requestParams,
      requestId: message.id,
    });
  }
);
