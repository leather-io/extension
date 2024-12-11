import { RouteUrls } from '@shared/route-urls';
import type { SwapRequest } from '@shared/rpc/methods/swap';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { makeSearchParamsWithDefaults, triggerSwapWindowOpen } from '../messaging-utils';
import { trackRpcRequestSuccess } from '../rpc-message-handler';

export async function rpcSwap(message: SwapRequest, port: chrome.runtime.Port) {
  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['requestId', message.id]]);
  const { from = 'STX', to } = message?.params || {};

  await triggerSwapWindowOpen(
    RouteUrls.Swap.replace(':base', from).replace(':quote', to ?? ''),
    urlParams
  );

  void trackRpcRequestSuccess({ endpoint: message.method });

  chrome.tabs.sendMessage(
    tabId,
    makeRpcSuccessResponse('swap', {
      id: message.id,
      result: { message: 'Success' },
    })
  );
}
