import { useMemo } from 'react';

import { isString } from '@shared/utils';

import { useInitialRouteSearchParams } from '@app/store/common/initial-route-search-params.hooks';

export function useDefaultRequestParams() {
  const params = useInitialRouteSearchParams();

  return useMemo(() => {
    const origin = params.get('origin');
    const tabId = params.get('tabId');

    return { origin, tabId: isString(tabId) ? parseInt(tabId) : tabId };
  }, [params]);
}
