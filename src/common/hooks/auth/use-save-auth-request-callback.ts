import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { decodeToken } from 'jsontokens';

import { useCurrentScreenUpdate, useUpdateAuthRequest } from '@store/onboarding/onboarding.hooks';
import { DecodedAuthRequest } from '@common/dev/types';
import { useWallet } from '@common/hooks/use-wallet';
import { getRequestOrigin, StorageKey } from '@common/storage';
import { RouteUrls } from '@common/types';
import { useOnboardingState } from './use-onboarding-state';

export function useSaveAuthRequest() {
  const { wallet } = useWallet();
  const { screen } = useOnboardingState();
  const changeScreen = useCurrentScreenUpdate();
  const saveAuthRequest = useUpdateAuthRequest();
  const location = useLocation();
  const accounts = wallet?.accounts;
  const saveAuthRequestParam = useCallback(
    (authRequest: string) => {
      const { payload } = decodeToken(authRequest);
      const decodedAuthRequest = (payload as unknown) as DecodedAuthRequest;
      const origin = getRequestOrigin(StorageKey.authenticationRequests, authRequest);
      const appName = decodedAuthRequest.appDetails?.name;
      const appIcon = decodedAuthRequest.appDetails?.icon;

      if (!appIcon) throw new Error('Missing `appIcon` from auth request');
      if (!appName) throw new Error('Missing `appName` from auth request');

      saveAuthRequest({
        decodedAuthRequest,
        authRequest,
        appName,
        appIcon,
        appURL: new URL(origin),
      });

      const hasIdentities = accounts && accounts.length;
      if (screen === RouteUrls.Installed && hasIdentities) {
        changeScreen(RouteUrls.ChooseAccount);
      }
    },
    [changeScreen, saveAuthRequest, screen, accounts]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authRequest = urlParams.get('authRequest');
    if (authRequest) {
      saveAuthRequestParam(authRequest);
    }
  }, [location.search, saveAuthRequestParam]);
}
