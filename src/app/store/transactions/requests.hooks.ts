import { useMemo } from 'react';

import { getPayloadFromToken } from '@shared/utils/requests';

import { useInitialRouteSearchParams } from '@app/store/common/initial-route-search-params.hooks';

export function useTransactionRequest() {
  const params = useInitialRouteSearchParams();
  return params.get('request');
}

export function useTransactionRequestState() {
  const requestToken = useTransactionRequest();
  return useMemo(() => {
    if (!requestToken) return null;
    return getPayloadFromToken(requestToken);
  }, [requestToken]);
}
