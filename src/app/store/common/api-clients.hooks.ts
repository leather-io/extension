import { useAtomValue } from 'jotai/utils';
import { apiClientAnchoredState, apiClientState } from '@app/store/common/api-clients';

export function useApi() {
  return useAtomValue(apiClientState);
}

export function useAnchoredApi() {
  return useAtomValue(apiClientAnchoredState);
}

export type Api = ReturnType<typeof useApi>;
