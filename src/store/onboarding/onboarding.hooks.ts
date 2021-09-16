import { useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import {
  authRequestState,
  currentScreenState,
  hasAllowedDiagnosticsState,
  magicRecoveryCodePasswordState,
  magicRecoveryCodeState,
  onboardingPathState,
  onboardingProgressState,
  secretKeyState,
  seedInputErrorState,
  seedInputState,
  userHasAllowedDiagnosticsKey,
  usernameState,
} from './onboarding';

export { userHasAllowedDiagnosticsKey };

export function useAuthRequest() {
  return useAtomValue(authRequestState);
}

export function useUpdateAuthRequest() {
  return useUpdateAtom(authRequestState);
}

export function useSeedInputState() {
  return useAtom(seedInputState);
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

export function useCurrentScreenState() {
  return useAtomValue(currentScreenState);
}

export function useCurrentScreenUpdate() {
  return useUpdateAtom(currentScreenState);
}

export function useOnboardingProgressState() {
  return useAtomValue(onboardingProgressState);
}

export function useUsernameState() {
  return useAtomValue(usernameState);
}

export function useOnboardingPathState() {
  return useAtomValue(onboardingPathState);
}

export function useHasAllowedDiagnostics() {
  return useAtom(hasAllowedDiagnosticsState);
}
