import { useAuthRequest } from '@app/store/onboarding/onboarding.hooks';

export const useAppDetails = () => {
  const { appName: name, appIcon: icon, appURL: url } = useAuthRequest();
  return { name, icon, url };
};
