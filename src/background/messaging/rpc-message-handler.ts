import { RouteUrls } from '@shared/route-urls';
import { WalletRequests } from '@shared/rpc/rpc-methods';

import {
  listenForPopupClose,
  makeSearchParamsWithDefaults,
  triggerRequestWindowOpen,
} from './messaging-utils';

export async function rpcMessageHander(message: WalletRequests, port: chrome.runtime.Port) {
  switch (message.method) {
    case 'getAddresses': {
      const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['requestId', message.id]]);
      const { id } = await triggerRequestWindowOpen(RouteUrls.RequestTapootAddress, urlParams);
      listenForPopupClose({ tabId, id, response: { id: message.id, result: null } });
      break;
    }
  }
}
