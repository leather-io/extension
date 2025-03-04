import { createRpcSuccessResponse, open } from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';

import { makeSearchParamsWithDefaults, triggerRequestWindowOpen } from '../messaging-utils';
import { trackRpcRequestSuccess } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';

export const openHandler = defineRpcRequestHandler(open.method, async (message, port) => {
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
});
