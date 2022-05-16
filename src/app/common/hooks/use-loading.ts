import { useLoadingState } from '@app/store/ui/ui.hooks';

export enum LoadingKeys {
  CONFIRM_DRAWER = 'loading/CONFIRM_DRAWER',
  EDIT_NONCE_DRAWER = 'loading/EDIT_NONCE_DRAWER',
  INCREASE_FEE_DRAWER = 'loading/INCREASE_FEE_DRAWER',
  SUBMIT_TRANSACTION = 'loading/SUBMIT_TRANSACTION',
  SUBMIT_SIGNATURE = 'loading/SUBMIT_SIGNATURE',
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
