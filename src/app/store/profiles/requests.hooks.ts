import { useMemo } from 'react';
import { useAsync } from 'react-async-hook';
import { useSearchParams } from 'react-router-dom';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';

export function useIsProfileUpdateRequestValid() {
  return useAsync(async () => {
    return true;
  }, []).result;
}

export function useProfileUpdateRequestSearchParams() {
  const [searchParams] = useSearchParams();
  const { origin, tabId } = useDefaultRequestParams();
  const requestToken = searchParams.get('request');
  return useMemo(
    () => ({
      origin,
      tabId: tabId || 1,
      requestToken,
    }),
    [origin, searchParams, tabId]
  );
}
