import { lastApiNonceState } from '@store/accounts/nonce';
import { useAtom } from 'jotai';

export function useLastApiNonceState() {
  return useAtom(lastApiNonceState);
}
