import { RpcErrorCode } from '@btckit/types';

import { RouteUrls } from '@shared/route-urls';
import { OpenWalletRequest } from '@shared/rpc/methods/open-wallet';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';

import {
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from '../messaging-utils';
import { trackRpcRequestSuccess } from '../rpc-message-handler';

export async function rpcOpenWallet(message: OpenWalletRequest, port: chrome.runtime.Port) {
  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['requestId', message.id]]);
  const { id } = await triggerRequestWindowOpen(RouteUrls.Home, urlParams);
  void trackRpcRequestSuccess({ endpoint: message.method });

  listenForPopupClose({
    tabId,
    id,
    response: makeRpcErrorResponse('openWallet', {
      id: message.id,
      error: {
        code: RpcErrorCode.USER_REJECTION,
        message: 'User rejected request to open wallet',
      },
    }),
  });
}
