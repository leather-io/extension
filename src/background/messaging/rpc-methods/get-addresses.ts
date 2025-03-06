import {
  RpcErrorCode,
  type RpcRequest,
  createRpcErrorResponse,
  encodeBase64Json,
  getAddresses,
  stxGetAddresses,
} from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';

import {
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';
import { trackRpcRequestSuccess } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';

function makeRpcAddressesMessageListener(eventName: 'getAddresses' | 'stx_getAddresses') {
  return async (
    message: RpcRequest<typeof getAddresses> | RpcRequest<typeof stxGetAddresses>,
    port: chrome.runtime.Port
  ) => {
    const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [
      ['requestId', message.id],
      ['rpcRequest', encodeBase64Json(message)],
    ]);

    if (message.params && message.params.network) {
      urlParams.append('network', message.params.network);
    }

    const { id } = await triggerRequestWindowOpen(RouteUrls.RpcGetAddresses, urlParams);
    void trackRpcRequestSuccess({ endpoint: message.method });

    listenForPopupClose({
      tabId,
      id,
      response: createRpcErrorResponse(eventName, {
        id: message.id,
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
