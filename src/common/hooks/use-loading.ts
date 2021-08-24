import { useLoadingStore } from '@store/ui/ui.hooks';

export enum LOADING_KEYS {
  SUBMIT_TRANSACTION = 'loading/SUBMIT_TRANSACTION',
}

export function useLoading(key: string) {
  const [state, setState] = useLoadingStore(key);

  const setIsLoading = () => setState('loading');
  const setIsIdle = () => setState('idle');

  const isLoading = state === 'loading';
  return {
    isLoading,
    setIsLoading,
    setIsIdle,
  };
}
