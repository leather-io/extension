import {
  RpcErrorCode,
  type RpcRequest,
  createRpcErrorResponse,
  encodeBase64Json,
  getAddresses,
  stxGetAddresses,
} from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';

import { trackRpcRequestSuccess } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';
import {
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestPopupWindowOpen,
} from '../rpc-request-utils';

function makeRpcAddressesMessageListener(eventName: 'getAddresses' | 'stx_getAddresses') {
  return async (
    request: RpcRequest<typeof getAddresses> | RpcRequest<typeof stxGetAddresses>,
    port: chrome.runtime.Port
  ) => {
    const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [
      ['requestId', request.id],
      ['rpcRequest', encodeBase64Json(request)],
    ]);

    if (request.params && request.params.network) {
      urlParams.append('network', request.params.network);
    }

    const { id } = await triggerRequestPopupWindowOpen(RouteUrls.RpcGetAddresses, urlParams);
    void trackRpcRequestSuccess({ endpoint: request.method });

    listenForPopupClose({
      tabId,
      id,
      response: createRpcErrorResponse(eventName, {
        id: request.id,
        error: {
          code: RpcErrorCode.USER_REJECTION,
          message: 'User rejected request to get addresses',
        },
      }),
    });
  };
}

export const getAddressesHandler = defineRpcRequestHandler(
  getAddresses.method,
  makeRpcAddressesMessageListener(getAddresses.method)
);

export const stxGetAddressesHandler = defineRpcRequestHandler(
  stxGetAddresses.method,
  makeRpcAddressesMessageListener(stxGetAddresses.method)
);
