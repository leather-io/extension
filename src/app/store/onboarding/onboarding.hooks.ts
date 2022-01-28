import { useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import {
  authRequestState,
  hasAllowedDiagnosticsState,
  secretKeyState,
  seedInputErrorState,
} from './onboarding';

export function useAuthRequest() {
  return useAtomValue(authRequestState);
}

export function useUpdateAuthRequest() {
  return useUpdateAtom(authRequestState);
}

export function useSeedInputErrorState() {
  return useAtom(seedInputErrorState);
}

export function useSecretKeyState() {
  return useAtomValue(secretKeyState);
}

export function useHasAllowedDiagnostics() {
  return useAtom(hasAllowedDiagnosticsState);
}
