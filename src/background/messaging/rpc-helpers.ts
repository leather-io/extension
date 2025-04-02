import { type RpcRequests } from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';

import { queueAnalyticsRequest } from '@background/background-analytics';

import {
  RequestParams,
  makeSearchParamsWithDefaults,
  sendErrorResponseOnUserPopupClose,
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

  sendErrorResponseOnUserPopupClose({ tabId, id, request });
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
