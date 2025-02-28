import { useMemo } from 'react';

import { RpcErrorMessage } from '@shared/rpc/methods/validation.utils';
import { getLegacyTransactionPayloadFromToken } from '@shared/utils/legacy-requests';

import { useDefaultRequestParams } from '../hooks/use-default-request-search-params';
import { initialSearchParams } from '../initial-search-params';

export interface RpcRequestContext {
  origin: string;
  requestId: string;
  tabId: number;
}

export function useRpcRequestParams() {
  const defaultParams = useDefaultRequestParams();
  return useMemo(
    () => ({
      ...defaultParams,
      requestId: initialSearchParams.get('requestId') ?? '',
    }),
    [defaultParams]
  );
}

// Duplicate of `useTransactionRequestState`, remove with legacy requests
export function useLegacyTxPayloadFromRpcRequest() {
  const request = initialSearchParams.get('request');
  if (!request) throw new Error(RpcErrorMessage.UndefinedParams);
  return useMemo(() => getLegacyTransactionPayloadFromToken(request), [request]);
}
