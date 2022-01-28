import { useAuthRequest, useSecretKeyState } from '@app/store/onboarding/onboarding.hooks';

export function useOnboardingState() {
  const secretKey = useSecretKeyState();
  const { authRequest, decodedAuthRequest, appName, appIcon, appURL } = useAuthRequest();

  return {
    secretKey,
    authRequest,
    decodedAuthRequest,
    appIcon,
    appName,
    appURL,
  };
}
