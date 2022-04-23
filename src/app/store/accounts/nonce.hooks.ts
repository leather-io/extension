import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';

import { currentAccountNonceState, lastApiNonceState } from '@app/store/accounts/nonce';

export function useCurrentAccountNonce() {
  return useAtomValue(currentAccountNonceState);
}

export function useLastApiNonceState() {
  return useAtom(lastApiNonceState);
}
