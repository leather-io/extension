import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';

export function usePsbtRequestSearchParams() {
  const [searchParams] = useSearchParams();
  const { origin, tabId } = useDefaultRequestParams();
  const requestToken = searchParams.get('request');
  return useMemo(
    () => ({
      origin,
      tabId: tabId ?? 1,
      requestToken,
    }),
    [origin, requestToken, tabId]
  );
}
