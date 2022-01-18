import {
  useAuthRequest,
  useCurrentScreenState,
  useMagicRecoveryCodeValue,
  useOnboardingPathState,
  useOnboardingProgressState,
  useSecretKeyState,
  useUsernameState,
} from '@store/onboarding/onboarding.hooks';

export const useOnboardingState = () => {
  const secretKey = useSecretKeyState();
  const screen = useCurrentScreenState();

  const { authRequest, decodedAuthRequest, appName, appIcon, appURL } = useAuthRequest();

  const magicRecoveryCode = useMagicRecoveryCodeValue();
  const isOnboardingInProgress = useOnboardingProgressState();
  const username = useUsernameState();
  const onboardingPath = useOnboardingPathState();

  return {
    secretKey,
    screen,
    authRequest,
    decodedAuthRequest,
    magicRecoveryCode,
    isOnboardingInProgress,
    username,
    onboardingPath,
    appIcon,
    appName,
    appURL,
  };
};
