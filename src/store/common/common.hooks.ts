import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import { errorStackTraceState } from '@store/ui/ui';
import { useAtom, WritableAtom } from 'jotai';
import { queryClient } from 'jotai-query-toolkit';

export type { WritableAtom } from 'jotai';

export function useDynamicUseAtom_UNSAFE(state: WritableAtom<boolean, boolean>) {
  return useAtom(state);
}

export const jotaiWrappedReactQueryQueryClient = queryClient;

export function useErrorHandler() {
  return useAtomCallback<void, any>(
    useCallback((_get, set, ...arg: any) => {
      set(errorStackTraceState, arg?.[0]?.stack);
    }, [])
  );
}
