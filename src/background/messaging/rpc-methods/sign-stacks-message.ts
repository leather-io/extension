import { RpcErrorCode } from '@btckit/types';

import { RouteUrls } from '@shared/route-urls';
import {
  SignStacksMessageRequest,
  getRpcSignStacksMessageParamErrors,
  validateRpcSignStacksMessageParams,
} from '@shared/rpc/methods/sign-stacks-message';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';
import { isDefined, isUndefined } from '@shared/utils';

import {
  RequestParams,
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';

export async function rpcSignStacksMessage(
  message: SignStacksMessageRequest,
  port: chrome.runtime.Port
) {
  if (isUndefined(message.params)) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('stx_signMessage', {
        id: message.id,
        error: { code: RpcErrorCode.INVALID_REQUEST, message: 'Parameters undefined' },
      })
    );
    return;
  }

  if (!validateRpcSignStacksMessageParams(message.params)) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('stx_signMessage', {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message: getRpcSignStacksMessageParamErrors(message.params),
        },
      })
    );
    return;
  }

  const requestParams: RequestParams = [
    ['message', message.params.message],
    ['messageType', message.params.messageType],
    ['requestId', message.id],
  ];

  if (isDefined(message.params.network)) {
    requestParams.push(['network', message.params.network.toString()]);
  }

  if (isDefined(message.params.domain)) {
    requestParams.push(['domain', message.params.domain.toString()]);
  }

  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, requestParams);

  const { id } = await triggerRequestWindowOpen(RouteUrls.RpcStacksSignature, urlParams);

  listenForPopupClose({
    tabId,
    id,
    response: makeRpcErrorResponse('stx_signMessage', {
      id: message.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: 'User rejected the Stacks message signing request',
      },
    }),
  });
}
