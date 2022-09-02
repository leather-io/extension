import { useAuthRequestParams } from './use-auth-request-params';

export function useAppDetails() {
  const { authDetails } = useAuthRequestParams();
  const { appName: name, appIcon: icon, appURL: url } = authDetails ?? {};
  return { name, icon, url };
}
