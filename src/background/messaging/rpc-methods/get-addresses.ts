import { type LeatherRpcMethodMap, type MethodNames, RpcErrorCode } from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';

import {
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';
import { trackRpcRequestSuccess } from '../rpc-message-handler';

export function makeRpcAddressesMessageListener<T extends MethodNames>(
  eventName: 'getAddresses' | 'stx_getAddresses'
) {
  return async (message: LeatherRpcMethodMap[T]['request'], port: chrome.runtime.Port) => {
    const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['requestId', message.id]]);
    const { id } = await triggerRequestWindowOpen(RouteUrls.RpcGetAddresses, urlParams);
    void trackRpcRequestSuccess({ endpoint: message.method });

    listenForPopupClose({
      tabId,
      id,
      response: makeRpcErrorResponse(eventName, {
        id: message.id,
        error: {
          code: RpcErrorCode.USER_REJECTION,
          message: 'User rejected request to get addresses',
        },
      }),
    });
  };
}

export const rpcGetAddresses = makeRpcAddressesMessageListener('getAddresses');
