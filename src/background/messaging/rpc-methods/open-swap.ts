import { createRpcSuccessResponse, openSwap } from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';
import { replaceRouteParams } from '@shared/utils/replace-route-params';

import { makeSearchParamsWithDefaults, triggerSwapWindowOpen } from '../messaging-utils';
import { trackRpcRequestSuccess } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';

export const openSwapHandler = defineRpcRequestHandler(openSwap.method, async (message, port) => {
  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['requestId', message.id]]);
  const { base = 'STX', quote } = message?.params || {};

  if (base === 'BTC') {
    await triggerSwapWindowOpen(
      replaceRouteParams(RouteUrls.Swap, {
        base: base,
        quote: quote ?? '',
      }).replace('{chain}', 'bitcoin'),
      urlParams
    );
  }

  await triggerSwapWindowOpen(
    replaceRouteParams(RouteUrls.Swap, {
      base: base,
      quote: quote ?? '',
    }).replace('{chain}', 'stacks'),
    urlParams
  );

  void trackRpcRequestSuccess({ endpoint: message.method });

  chrome.tabs.sendMessage(
    tabId,
    createRpcSuccessResponse('openSwap', {
      id: message.id,
      result: { message: 'Success' },
    })
  );
});
