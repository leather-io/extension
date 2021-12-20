import { lastApiNonceState } from '@app/store/accounts/nonce';
import { useAtom } from 'jotai';

export function useLastApiNonceState() {
  return useAtom(lastApiNonceState);
}
