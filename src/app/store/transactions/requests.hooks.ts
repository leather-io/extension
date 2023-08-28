import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { TransactionPayload } from '@stacks/connect';

import { getPayloadFromToken } from '@shared/utils/requests';

import { initialSearchParams } from '@app/common/initial-search-params';

export function useTransactionRequest() {
  return initialSearchParams.get('request');
}

export function useTransactionRequestState() {
  const location = useLocation();
  const requestToken = useTransactionRequest();
  return useMemo(() => {
    if (
      typeof location.state === 'object' &&
      location.state != null &&
      'txType' in location.state
    ) {
      return location.state as TransactionPayload;
    }
    if (!requestToken) return null;
    return getPayloadFromToken(requestToken);
  }, [requestToken]);
}
