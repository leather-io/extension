import { RpcErrorCode, type RpcMethodNames, createRpcErrorResponse } from '@leather.io/rpc';

import type { RootState } from '@app/store';

export async function getRootState() {
  const storage = await chrome.storage.local.get(['persist:root']);
  if (!storage || !storage['persist:root']) return null;
  return storage['persist:root'] as RootState;
}

interface SendMissingStateErrorToTabArgs {
  tabId: number;
  method: RpcMethodNames;
  id: string;
}
export function sendMissingStateErrorToTab({ tabId, method, id }: SendMissingStateErrorToTabArgs) {
  return chrome.tabs.sendMessage(
    tabId,
    createRpcErrorResponse(method, {
      id,
      error: {
        code: RpcErrorCode.INTERNAL_ERROR,
        message: 'Internal error, wallet not initialized',
      },
    })
  );
}
