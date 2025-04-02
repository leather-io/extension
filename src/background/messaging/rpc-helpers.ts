import { RpcErrorCode, type RpcRequests, createRpcErrorResponse } from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';
import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';

import { queueAnalyticsRequest } from '@background/background-analytics';

import {
  RequestParams,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestPopupWindowOpen,
} from './rpc-request-utils';

interface HandleRpcMessageArgs {
  request: RpcRequests;
  path: RouteUrls;
  port: chrome.runtime.Port;
  requestParams: RequestParams;
}
export async function handleRpcMessage({
  request,
  path,
  port,
  requestParams,
}: HandleRpcMessageArgs) {
  void trackRpcRequestSuccess({ endpoint: request.method });

  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, requestParams);
  const { id } = await triggerRequestPopupWindowOpen(path, urlParams);

  listenForPopupClose({
    tabId,
    id,
    response: createRpcErrorResponse(request.method, {
      id: request.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: RpcErrorMessage.UserRejectedSigning,
      },
    }),
  });
}

interface TrackRpcRequestSuccess {
  endpoint: RpcRequests['method'];
}
export async function trackRpcRequestSuccess(args: TrackRpcRequestSuccess) {
  return queueAnalyticsRequest('rpc_request_successful', { ...args });
}

interface TrackRpcRequestError {
  endpoint: RpcRequests['method'];
  error: string;
}
export async function trackRpcRequestError(args: TrackRpcRequestError) {
  return queueAnalyticsRequest('rpc_request_error', { ...args });
}

export function openNewTabWithWallet() {
  return chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
}
