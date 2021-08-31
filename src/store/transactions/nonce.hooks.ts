import { atom, useAtom } from 'jotai';

export const customNonceState = atom<number | undefined>(undefined);

export function useCustomNonce() {
  return useAtom(customNonceState);
}
