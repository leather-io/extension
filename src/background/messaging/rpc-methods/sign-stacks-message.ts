import { serializeCV } from '@stacks/transactions';

import {
  RpcErrorCode,
  type StxSignMessageRequest,
  type StxSignMessageRequestParamsStructured,
  type StxSignStructuredMessageRequest,
} from '@leather.io/rpc';
import { isDefined, isString, isUndefined } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';
import {
  getRpcSignStacksMessageParamErrors,
  validateRpcSignStacksMessageParams,
} from '@shared/rpc/methods/sign-stacks-message';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';

import {
  RequestParams,
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';
import { trackRpcRequestError, trackRpcRequestSuccess } from '../rpc-message-handler';

async function handleRpcSignStacksMessage(
  method: 'stx_signMessage' | 'stx_signStructuredMessage',
  message: StxSignMessageRequest | StxSignStructuredMessageRequest,
  port: chrome.runtime.Port,
  requestParams: RequestParams
) {
  if (isUndefined(message.params)) {
    void trackRpcRequestError({ endpoint: method, error: 'Undefined parameters' });
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse(method, {
        id: message.id,
        error: { code: RpcErrorCode.INVALID_REQUEST, message: 'Parameters undefined' },
      })
    );
    return;
  }

  if (!validateRpcSignStacksMessageParams(message.params)) {
    void trackRpcRequestError({ endpoint: method, error: 'Invalid parameters' });
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse(method, {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message: getRpcSignStacksMessageParamErrors(message.params),
        },
      })
    );
    return;
  }

  void trackRpcRequestSuccess({ endpoint: method });

  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, requestParams);

  const { id } = await triggerRequestWindowOpen(RouteUrls.RpcStacksSignature, urlParams);

  listenForPopupClose({
    tabId,
    id,
    response: makeRpcErrorResponse(method, {
      id: message.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: 'User rejected the Stacks message signing request',
      },
    }),
  });
}

export function rpcSignStacksMessage(message: StxSignMessageRequest, port: chrome.runtime.Port) {
  const requestParams: RequestParams = [
    ['message', message.params.message],
    ['messageType', message.params.messageType],
    ['requestId', message.id],
  ];

  if (isDefined(message.params.network)) {
    requestParams.push(['network', message.params.network.toString()]);
  }

  if ('domain' in message.params) {
    requestParams.push([
      'domain',
      (message.params as StxSignMessageRequestParamsStructured).domain.toString(),
    ]);
  }

  return handleRpcSignStacksMessage('stx_signMessage', message, port, requestParams);
}

export function rpcSignStacksStructuredMessage(
  message: StxSignStructuredMessageRequest,
  port: chrome.runtime.Port
) {
  const requestParams: RequestParams = [
    ['requestId', message.id],
    ['messageType', 'structured'],
    [
      'message',
      isString(message.params.message)
        ? message.params.message
        : serializeCV(message.params.message),
    ],
    [
      'domain',
      isString(message.params.domain) ? message.params.domain : serializeCV(message.params.domain),
    ],
  ];

  return handleRpcSignStacksMessage('stx_signStructuredMessage', message, port, requestParams);
}
