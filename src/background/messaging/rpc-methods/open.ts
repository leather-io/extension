import {
  RpcErrorCode,
  createRpcErrorResponse,
  createRpcSuccessResponse,
  open,
} from '@leather.io/rpc';

import { hasRequestedAccountPermission } from '@shared/permissions/permission.helpers';
import { RouteUrls } from '@shared/route-urls';

import { getRootState, sendMissingStateErrorToTab } from '@background/get-root-state';

import {
  getHostnameFromPort,
  makeSearchParamsWithDefaults,
  triggerRequestPopupWindowOpen,
} from '../messaging-utils';
import { openNewTabWithWallet, trackRpcRequestSuccess } from '../rpc-helpers';
import { defineRpcRequestHandler } from '../rpc-message-handler';

export const openHandler = defineRpcRequestHandler(open.method, async (message, port) => {
  const { urlParams, tabId } = makeSearchParamsWithDefaults(port, [['requestId', message.id]]);

  const state = await getRootState();
  const hostname = getHostnameFromPort(port);

  if (!state) {
    sendMissingStateErrorToTab({ tabId, method: message.method, id: message.id });
    return;
  }

  const originPermissions = state.appPermissions.entities[hostname];

  if (!originPermissions || !hasRequestedAccountPermission(originPermissions)) {
    chrome.tabs.sendMessage(
      tabId,
      createRpcErrorResponse('open', {
        id: message.id,
        error: {
          code: RpcErrorCode.UNAUTHENTICATED,
          message: 'Permission denied, user must first connect to the wallet',
        },
      })
    );
    return;
  }

  switch (message.params.mode) {
    case 'fullpage':
      openNewTabWithWallet();
      break;
    case 'popup':
    default:
      void triggerRequestPopupWindowOpen(RouteUrls.Home, urlParams);
      break;
  }

  void trackRpcRequestSuccess({ endpoint: message.method });

  chrome.tabs.sendMessage(
    tabId,
    createRpcSuccessResponse('open', {
      id: message.id,
      result: { success: true },
    })
  );
});
