import { useContext, useMemo } from 'react';

import { getPayloadFromToken } from '@shared/utils/requests';

import { initialSearchParams } from '@app/common/initial-search-params';
import { stacksTransactionContext } from '@app/features/stacks-transaction-request/components/stacks-transaction.context';

export function useTransactionRequest() {
  return initialSearchParams.get('request');
}

export function useTransactionRequestState() {
  const requestToken = useTransactionRequest();
  const payload = useContext(stacksTransactionContext);

  return useMemo(() => {
    if (!requestToken) {
      if (payload) {
        return payload;
      }
      return null;
    }
    return getPayloadFromToken(requestToken);
  }, [requestToken]);
}
