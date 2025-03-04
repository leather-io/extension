import {
  RpcErrorCode,
  type RpcMethodNames,
  type RpcRequests,
  createRpcErrorResponse,
} from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';
import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';

import { queueAnalyticsRequest } from '@background/background-analytics';

import {
  RequestParams,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from './messaging-utils';

interface HandleRpcMessageArgs {
  method: RpcMethodNames;
  path: RouteUrls;
  port: chrome.runtime.Port;
  requestParams: RequestParams;
  requestId: string;
}
export async function handleRpcMessage({
  method,
  path,
  port,
  requestParams,
  requestId,
}: HandleRpcMessageArgs) {
  void trackRpcRequestSuccess({ endpoint: method });

  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, requestParams);
  const { id } = await triggerRequestWindowOpen(path, urlParams);

  listenForPopupClose({
    tabId,
    id,
    response: createRpcErrorResponse(method, {
      id: requestId,
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
