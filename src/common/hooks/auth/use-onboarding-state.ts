import {
  useAuthRequest,
  useMagicRecoveryCodeValue,
  useSecretKeyState,
} from '@store/onboarding/onboarding.hooks';

export const useOnboardingState = () => {
  const secretKey = useSecretKeyState();
  const { authRequest, decodedAuthRequest, appName, appIcon, appURL } = useAuthRequest();
  const magicRecoveryCode = useMagicRecoveryCodeValue();

  return {
    secretKey,
    authRequest,
    decodedAuthRequest,
    magicRecoveryCode,
    appIcon,
    appName,
    appURL,
  };
};
