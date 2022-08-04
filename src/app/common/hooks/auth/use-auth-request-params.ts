import { useMemo } from 'react';
import { useInitialRouteSearchParams } from '@app/store/common/initial-route-search-params.hooks';
import { useDefaultRequestParams } from '../use-default-request-search-params';

export function useAuthRequestParams() {
  const [params] = useInitialRouteSearchParams();
  const { origin, tabId } = useDefaultRequestParams();

  return useMemo(() => {
    const authRequest = params.get('authRequest');
    return { origin, tabId, authRequest };
  }, [origin, params, tabId]);
}
