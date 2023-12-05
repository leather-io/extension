import { useAtom } from 'jotai';

import { errorStackTraceState, loadingState } from './ui';

export function useLoadingState(key: string) {
  return useAtom(loadingState(key));
}

export function useErrorStackTraceState() {
  return useAtom(errorStackTraceState);
}
