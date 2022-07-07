import { useMemo } from 'react';
import { useInitialRouteSearchParams } from '@app/store/common/initial-route-search-params.hooks';

export function useAuthRequestParams() {
  const [params] = useInitialRouteSearchParams();
  return useMemo(() => ({ origin: params.get('origin') }), [params]);
}
