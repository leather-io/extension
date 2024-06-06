import { useAtom } from 'jotai';

import { loadingState } from './ui';

export function useLoadingState(key: string) {
  return useAtom(loadingState(key));
}
