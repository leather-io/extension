import { useAtom } from 'jotai';

import { currentAccountNonceState } from '@app/store/nonce/nonce';

export function useCurrentAccountNonceState() {
  return useAtom(currentAccountNonceState);
}
