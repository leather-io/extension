import { RpcErrorCode, type RpcMethodNames, createRpcErrorResponse } from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';
import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';

import {
  RequestParams,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from './messaging-utils';
import { trackRpcRequestSuccess } from './rpc-message-handler';

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
