import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { decodeToken } from 'jsontokens';

import { useUpdateAuthRequest } from '@store/onboarding/onboarding.hooks';
import { DecodedAuthRequest } from '@common/dev/types';
import { useWallet } from '@common/hooks/use-wallet';
import { getRequestOrigin, StorageKey } from '@common/storage';
import { RouteUrls } from '@routes/route-urls';
import { useChangeScreen } from '../use-change-screen';

export function useSaveAuthRequest() {
  const { wallet } = useWallet();
  const changeScreen = useChangeScreen();
  const saveAuthRequest = useUpdateAuthRequest();
  const location = useLocation();
  const accounts = wallet?.accounts;
  const saveAuthRequestParam = useCallback(
    (authRequest: string) => {
      const { payload } = decodeToken(authRequest);
      const decodedAuthRequest = payload as unknown as DecodedAuthRequest;
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
      if (
        (location.pathname === RouteUrls.Onboarding || location.pathname === RouteUrls.SignIn) &&
        hasIdentities
      ) {
        changeScreen(RouteUrls.ChooseAccount);
      }
    },
    [saveAuthRequest, location, accounts, changeScreen]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authRequest = urlParams.get('authRequest');
    if (authRequest) {
      saveAuthRequestParam(authRequest);
    }
  }, [location.search, saveAuthRequestParam]);
}
