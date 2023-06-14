import { RpcErrorCode, SendTransferRequest } from '@btckit/types';

import { RouteUrls } from '@shared/route-urls';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';

import {
  getTabIdFromPort,
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';

export async function rpcSendTransfer(message: SendTransferRequest, port: chrome.runtime.Port) {
  if (!message.params || !message.params.address || !message.params.amount) {
    chrome.tabs.sendMessage(
      getTabIdFromPort(port),
      makeRpcErrorResponse('sendTransfer', {
        id: message.id,
        error: {
          code: RpcErrorCode.INVALID_PARAMS,
          message:
            'Invalid parameters. See the btckit spec for more information: https://btckit.org/docs/spec',
        },
      })
    );
    return;
  }
  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [
    ['address', message.params.address],
    ['amount', message.params.amount],
    ['requestId', message.id],
  ]);
  const { id } = await triggerRequestWindowOpen(RouteUrls.RpcSendTransfer, urlParams);
  listenForPopupClose({
    tabId,
    id,
    response: makeRpcErrorResponse('sendTransfer', {
      id: message.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: 'User rejected signing the transaction',
      },
    }),
  });
}
