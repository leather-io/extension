import { type RpcRequest, createRpcSuccessResponse, type open } from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';

import { makeSearchParamsWithDefaults, triggerRequestWindowOpen } from '../messaging-utils';
import { trackRpcRequestSuccess } from '../rpc-message-handler';

export async function rpcOpen(message: RpcRequest<typeof open>, port: chrome.runtime.Port) {
  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['requestId', message.id]]);

  await triggerRequestWindowOpen(RouteUrls.Home, urlParams);
  void trackRpcRequestSuccess({ endpoint: message.method });

  chrome.tabs.sendMessage(
    tabId,
    createRpcSuccessResponse('open', {
      id: message.id,
      result: { message: 'Success' },
    })
  );
}
