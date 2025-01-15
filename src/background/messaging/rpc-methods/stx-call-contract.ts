import { type ClarityValue, serializeCV } from '@stacks/transactions';
import { createUnsecuredToken } from 'jsontokens';

import {
  RpcErrorCode,
  type StxCallContractRequest,
  type StxCallContractRequestParams,
} from '@leather.io/rpc';
import { TransactionTypes, getStacksContractName } from '@leather.io/stacks';
import { isUndefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import {
  getRpcStxCallContractParamErrors,
  validateRpcStxCallContractParams,
} from '@shared/rpc/methods/stx-call-contract';
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

function getMessageParamsToTransactionRequest(params: StxCallContractRequestParams) {
  const contractName = getStacksContractName(params.contract);
  const defaultParams = getStxDefaultMessageParamsToTransactionRequest(params);

  return {
    txType: TransactionTypes.ContractCall,
    contractAddress: params.contract.split('.')[0],
    contractName,
    functionArgs: (params.functionArgs ?? []).map(arg =>
      serializeCV(arg as unknown as ClarityValue)
    ),
    functionName: params.functionName,
    ...defaultParams,
  };
}

export async function rpcStxCallContract(
  message: StxCallContractRequest,
  port: chrome.runtime.Port
) {
  if (isUndefined(message.params)) {
    void trackRpcRequestError({ endpoint: message.method, error: 'Undefined parameters' });
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('stx_callContract', {
        id: message.id,
        error: { code: RpcErrorCode.INVALID_REQUEST, message: 'Parameters undefined' },
      })
    );
    return;
  }

  if (!validateRpcStxCallContractParams(message.params)) {
    void trackRpcRequestError({ endpoint: message.method, error: 'Invalid parameters' });

    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('stx_callContract', {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message: getRpcStxCallContractParamErrors(message.params),
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

  const { id } = await triggerRequestWindowOpen(RouteUrls.RpcStxCallContract, urlParams);

  listenForPopupClose({
    tabId,
    id,
    response: makeRpcErrorResponse('stx_callContract', {
      id: message.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: 'User rejected the Stacks transaction signing request',
      },
    }),
  });
}
