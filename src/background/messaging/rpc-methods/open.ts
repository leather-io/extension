import { RouteUrls } from '@shared/route-urls';
import { OpenRequest } from '@shared/rpc/methods/open';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { makeSearchParamsWithDefaults, triggerRequestWindowOpen } from '../messaging-utils';
import { trackRpcRequestSuccess } from '../rpc-message-handler';

export async function rpcOpen(message: OpenRequest, port: chrome.runtime.Port) {
  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['requestId', message.id]]);

  await triggerRequestWindowOpen(RouteUrls.Home, urlParams);
  void trackRpcRequestSuccess({ endpoint: message.method });

  chrome.tabs.sendMessage(
    tabId,
    makeRpcSuccessResponse('open', {
      id: message.id,
      result: { message: 'Success' },
    })
  );
}
