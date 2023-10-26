import { useLoadingState } from '@app/store/ui/ui.hooks';

export enum LoadingKeys {
  INCREASE_FEE_DRAWER = 'loading/INCREASE_FEE_DRAWER',
  SUBMIT_SEND_FORM_TRANSACTION = 'loading/SUBMIT_SEND_FORM_TRANSACTION',
  SUBMIT_SWAP_TRANSACTION = 'loading/SUBMIT_SWAP_TRANSACTION',
  SUBMIT_TRANSACTION_REQUEST = 'loading/SUBMIT_TRANSACTION_REQUEST',
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
