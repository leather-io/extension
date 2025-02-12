import { RpcErrorCode, type StxTransferStxRequest } from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';

import {
  type RequestParams,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';

export async function rpcStxTransferStx(message: StxTransferStxRequest, port: chrome.runtime.Port) {
  const requestParams: RequestParams = [
    ['params', encodeURIComponent(JSON.stringify(message.params))],
    ['requestId', message.id],
  ];

  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, requestParams);

  const { id } = await triggerRequestWindowOpen(RouteUrls.RpcStxTransferStx, urlParams);

  listenForPopupClose({
    tabId,
    id,
    response: makeRpcErrorResponse('stx_transferStx', {
      id: message.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: 'User rejected the Stacks transaction signing request',
      },
    }),
  });
}
