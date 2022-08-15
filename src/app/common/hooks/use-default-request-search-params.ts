import { useMemo } from 'react';
import { useInitialRouteSearchParams } from '@app/store/common/initial-route-search-params.hooks';
import { isString } from '@shared/utils';

export function useDefaultRequestParams() {
  const [params] = useInitialRouteSearchParams();

  return useMemo(() => {
    const origin = params.get('origin');
    const tabId = params.get('tabId');

    return { origin, tabId: isString(tabId) ? parseInt(tabId) : tabId };
  }, [params]);
}
