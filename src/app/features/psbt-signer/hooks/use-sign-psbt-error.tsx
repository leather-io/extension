import { useCallback } from 'react';

import { RpcErrorCode } from '@btckit/types';

import { finalizePsbt } from '@shared/actions/finalize-psbt';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';

import {
  usePsbtRequestSearchParams,
  useRpcSignPsbtParams,
} from '@app/common/psbt/use-psbt-request-params';

export function useSignPsbtError() {
  const { requestToken, tabId } = usePsbtRequestSearchParams();
  const { requestId, tabId: rpcTabId } = useRpcSignPsbtParams();

  return useCallback(
    (errorMsg: string) => {
      if (requestToken)
        finalizePsbt({
          requestPayload: requestToken,
          tabId,
          data: errorMsg,
        });
      chrome.tabs.sendMessage(
        rpcTabId,
        makeRpcErrorResponse('signPsbt', {
          id: requestId,
          error: {
            message: errorMsg,
            code: RpcErrorCode.INTERNAL_ERROR,
          },
        })
      );
      window.close();
    },
    [requestId, requestToken, rpcTabId, tabId]
  );
}
