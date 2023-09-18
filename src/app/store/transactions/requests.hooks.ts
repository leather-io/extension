import { useMemo } from 'react';

import { getPayloadFromToken } from '@shared/utils/requests';

import { initialSearchParams } from '@app/common/initial-search-params';

export function useTransactionRequest() {
  return initialSearchParams.get('request');
}

export function useTransactionRequestState() {
  const requestToken = useTransactionRequest();

  return useMemo(() => {
    if (!requestToken) return null;
    return getPayloadFromToken(requestToken);
  }, [requestToken]);
}
