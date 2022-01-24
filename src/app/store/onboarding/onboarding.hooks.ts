import { useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import {
  authRequestState,
  hasAllowedDiagnosticsState,
  magicRecoveryCodePasswordState,
  magicRecoveryCodeState,
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

export function useMagicRecoveryCodeState() {
  return useAtom(magicRecoveryCodeState);
}

export function useMagicRecoveryCodeValue() {
  return useAtomValue(magicRecoveryCodeState);
}

export function useMagicRecoveryCodePasswordState() {
  return useAtom(magicRecoveryCodePasswordState);
}

export function useSecretKeyState() {
  return useAtomValue(secretKeyState);
}

export function useHasAllowedDiagnostics() {
  return useAtom(hasAllowedDiagnosticsState);
}
