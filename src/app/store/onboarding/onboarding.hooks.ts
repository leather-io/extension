import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';

import { secretKeyState, seedInputErrorState } from './onboarding';

export function useSeedInputErrorState() {
  return useAtom(seedInputErrorState);
}

export function useSecretKeyState() {
  return useAtomValue(secretKeyState);
}
