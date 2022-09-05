import { useEffect, useMemo } from 'react';
import { useUpdateAtom } from 'jotai/utils';

import { useInitialRouteSearchParams } from '../common/initial-route-search-params.hooks';
import { getPayloadFromToken } from './utils';
import { requestTokenPayloadState } from './requests';

export function useTransactionRequest() {
  const params = useInitialRouteSearchParams();
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
