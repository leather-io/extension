import { type Json, createUnsecuredToken } from 'jsontokens';

import {
  RpcErrorCode,
  type StxDeployContractRequest,
  type StxDeployContractRequestParams,
} from '@leather.io/rpc';
import { TransactionTypes } from '@leather.io/stacks';
import { isDefined, isUndefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import {
  getRpcStxDeployContractParamErrors,
  validateRpcStxDeployContractParams,
} from '@shared/rpc/methods/stx-deploy-contract';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';

import {
  RequestParams,
  getStxDefaultMessageParamsToTransactionRequest,
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';
import { trackRpcRequestError, trackRpcRequestSuccess } from '../rpc-message-handler';

function getMessageParamsToTransactionRequest(params: StxDeployContractRequestParams) {
  const defaultParams = getStxDefaultMessageParamsToTransactionRequest(params);
  const txRequest: Json = {
    txType: TransactionTypes.ContractDeploy,
    contractName: params.name,
    codeBody: params.clarityCode,
    ...defaultParams,
  };

  if ('clarityVersion' in params && isDefined(params.clarityVersion)) {
    txRequest.clarityVersion = params.clarityVersion;
  }
  return txRequest;
}

export async function rpcStxDeployContract(
  message: StxDeployContractRequest,
  port: chrome.runtime.Port
) {
  if (isUndefined(message.params)) {
    void trackRpcRequestError({ endpoint: message.method, error: 'Undefined parameters' });
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('stx_deployContract', {
        id: message.id,
        error: { code: RpcErrorCode.INVALID_REQUEST, message: 'Parameters undefined' },
      })
    );
    return;
  }

  if (!validateRpcStxDeployContractParams(message.params)) {
    void trackRpcRequestError({ endpoint: message.method, error: 'Invalid parameters' });

    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('stx_deployContract', {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message: getRpcStxDeployContractParamErrors(message.params),
        },
      })
    );
    return;
  }

  const request = getMessageParamsToTransactionRequest(message.params);

  void trackRpcRequestSuccess({ endpoint: message.method });

  const requestParams: RequestParams = [
    ['requestId', message.id],
    ['request', createUnsecuredToken(request)],
  ];

  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, requestParams);

  const { id } = await triggerRequestWindowOpen(RouteUrls.RpcStxDeployContract, urlParams);

  listenForPopupClose({
    tabId,
    id,
    response: makeRpcErrorResponse('stx_deployContract', {
      id: message.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: 'User rejected the Stacks transaction signing request',
      },
    }),
  });
}
