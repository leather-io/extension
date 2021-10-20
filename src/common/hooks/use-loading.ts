import { useLoadingState } from '@store/ui/ui.hooks';

export enum LoadingKeys {
  SUBMIT_TRANSACTION = 'loading/SUBMIT_TRANSACTION',
  EDIT_NONCE_DRAWER = 'loading/EDIT_NONCE_DRAWER',
  INCREASE_FEE_DRAWER = 'loading/INCREASE_FEE_DRAWER',
  SEND_TOKENS_FORM = 'loading/SEND_TOKENS_FORM',
  CONFIRM_DRAWER = 'loading/CONFIRM_DRAWER',
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
