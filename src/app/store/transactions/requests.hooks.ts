import { useCallback, useEffect, useMemo } from 'react';
import { useAtomCallback, useUpdateAtom, useAtomValue } from 'jotai/utils';

import { transactionBroadcastErrorState } from '@app/store/transactions/transaction';
import { finalizeTxSignature } from '@app/common/actions/finalize-tx-signature';
import { useInitialRouteSearchParams } from '../common/initial-route-search-params.hooks';
import { getPayloadFromToken } from './utils';
import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { requestTokenPayloadState } from './requests';

export function useTransactionRequest() {
  const [params] = useInitialRouteSearchParams();
  return params.get('request');
}

export function useSetTransactionRequestAtom(request: string | null) {
  const updateRequestTokenState = useUpdateAtom(requestTokenPayloadState);

  useEffect(() => {
    if (request) updateRequestTokenState(getPayloadFromToken(request));
  }, [request, updateRequestTokenState]);
}

export function useTransactionRequestState() {
  const requestToken = useTransactionRequest();
  return useMemo(() => {
    if (!requestToken) return null;
    return getPayloadFromToken(requestToken);
  }, [requestToken]);
}

export function useTransactionBroadcastError() {
  return useAtomValue(transactionBroadcastErrorState);
}

export function useUpdateTransactionBroadcastError() {
  return useUpdateAtom(transactionBroadcastErrorState);
}

export function useOnCancelTransaction() {
  const { tabId } = useDefaultRequestParams();
  const requestToken = useTransactionRequest();

  return useAtomCallback(
    useCallback(
      async (_, set) => {
        if (!requestToken) {
          set(transactionBroadcastErrorState, 'No pending transaction');
          return;
        }
        if (!tabId) throw new Error('Cannot cancel tx request with no tabId');
        try {
          finalizeTxSignature({ requestPayload: requestToken, data: 'cancel', tabId });
        } catch (error) {
          if (error instanceof Error) set(transactionBroadcastErrorState, error.message);
        }
      },
      [requestToken, tabId]
    )
  );
}
