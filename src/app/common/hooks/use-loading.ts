import { useLoadingState } from '@app/store/ui/ui.hooks';

export enum LoadingKeys {
  SUBMIT_STACKS_TRANSACTION = 'loading/SUBMIT_STACKS_TRANSACTION',
  SUBMIT_SWAP_TRANSACTION = 'loading/SUBMIT_SWAP_TRANSACTION',
}

export function useLoading(key: string) {
  const [state, setState] = useLoadingState(key);

  const setIsLoading = () => setState('loading');
  const setIsIdle = () => setState('idle');

  const isLoading = state === 'loading';
  return {
    isLoading,
    setIsLoading,
    setIsIdle,
  };
}
