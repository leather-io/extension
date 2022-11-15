import { useSecretKeyState } from '@app/store/onboarding/onboarding.hooks';

import { useAuthRequestParams } from './use-auth-request-params';

export function useOnboardingState() {
  const secretKey = useSecretKeyState();
  const { authDetails } = useAuthRequestParams();
  const { authRequest, decodedAuthRequest, appName, appIcon, appURL } = authDetails ?? {};

  return {
    secretKey,
    authRequest,
    decodedAuthRequest,
    appIcon,
    appName,
    appURL,
  };
}
