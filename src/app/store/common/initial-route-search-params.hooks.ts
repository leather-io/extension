import { useAtom } from 'jotai';
import { initialRouteSearchParams } from './initial-route-search-params';

export function useInitialRouteSearchParams() {
  return useAtom(initialRouteSearchParams);
}
