import { useMemo } from 'react';

import { useDefaultRequestParams } from './hooks/use-default-request-search-params';
import { initialSearchParams } from './initial-search-params';

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
