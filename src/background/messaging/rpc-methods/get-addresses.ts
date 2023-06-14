import { GetAddressesRequest, RpcErrorCode } from '@btckit/types';

import { RouteUrls } from '@shared/route-urls';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';

import {
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';

export async function rpcGetAddresses(message: GetAddressesRequest, port: chrome.runtime.Port) {
  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['requestId', message.id]]);
  const { id } = await triggerRequestWindowOpen(RouteUrls.RpcGetAddresses, urlParams);
  listenForPopupClose({
    tabId,
    id,
    response: {
      id: message.id,
      result: makeRpcErrorResponse('getAddresses', {
        id: message.id,
        error: {
          code: RpcErrorCode.USER_REJECTION,
          message: 'User rejected request to get addresses',
        },
      }),
    },
  });
}
