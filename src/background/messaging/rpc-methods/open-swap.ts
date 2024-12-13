import type { OpenSwapRequest } from '@leather.io/rpc';

import { RouteUrls } from '@shared/route-urls';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { makeSearchParamsWithDefaults, triggerSwapWindowOpen } from '../messaging-utils';
import { trackRpcRequestSuccess } from '../rpc-message-handler';

export async function rpcSwap(message: OpenSwapRequest, port: chrome.runtime.Port) {
  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['requestId', message.id]]);
  const { base = 'STX', quote } = message?.params || {};

  await triggerSwapWindowOpen(
    RouteUrls.Swap.replace(':base', base).replace(':quote', quote ?? ''),
    urlParams
  );

  void trackRpcRequestSuccess({ endpoint: message.method });

  chrome.tabs.sendMessage(
    tabId,
    makeRpcSuccessResponse('openSwap', {
      id: message.id,
      result: { message: 'Success' },
    })
  );
}
