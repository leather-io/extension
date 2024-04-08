import { RpcErrorCode } from '@btckit/types';

import { RouteUrls } from '@shared/route-urls';
import { GetXpubRequest } from '@shared/rpc/methods/get-xpub';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';

import {
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';

export async function rpcGetXpub(message: GetXpubRequest, port: chrome.runtime.Port) {
  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['requestId', message.id]]);
  const { id } = await triggerRequestWindowOpen(RouteUrls.RpcGetXpub, urlParams);
  listenForPopupClose({
    tabId,
    id,
    response: {
      id: message.id,
      result: makeRpcErrorResponse('getXpub', {
        id: message.id,
        error: {
          code: RpcErrorCode.USER_REJECTION,
          message: 'User rejected request to get xpub',
        },
      }),
    },
  });
}
