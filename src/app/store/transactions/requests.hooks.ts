import { useEffect, useMemo } from 'react';
import { useUpdateAtom, useAtomValue } from 'jotai/utils';

import { transactionBroadcastErrorState } from '@app/store/transactions/transaction';
import { useInitialRouteSearchParams } from '../common/initial-route-search-params.hooks';
import { getPayloadFromToken } from './utils';
import { requestTokenPayloadState } from './requests';

export function useTransactionRequest() {
  const [params] = useInitialRouteSearchParams();
  return useMemo(() => params.get('request'), [params]);
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
