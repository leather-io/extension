import { useAtom, useAtomValue } from 'jotai';

import { secretKeyState, seedInputErrorState } from './onboarding';

export function useSeedInputErrorState() {
  return useAtom(seedInputErrorState);
}

export function useSecretKeyState() {
  return useAtomValue(secretKeyState);
}
