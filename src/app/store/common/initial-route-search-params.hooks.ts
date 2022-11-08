import { useAtomValue, useUpdateAtom } from 'jotai/utils';

import { initialRouteSearchParams } from './initial-route-search-params';

export function useSetInitialRouteSearchParams() {
  return useUpdateAtom(initialRouteSearchParams);
}

export function useInitialRouteSearchParams() {
  return useAtomValue(initialRouteSearchParams);
}
