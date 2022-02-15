import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { decodeToken } from 'jsontokens';

import { useUpdateAuthRequest } from '@app/store/onboarding/onboarding.hooks';
import { DecodedAuthRequest } from '@app/common/dev/types';
import { getRequestOrigin, StorageKey } from '@shared/utils/storage';
import { RouteUrls } from '@shared/route-urls';

export function useSaveAuthRequest() {
  const navigate = useNavigate();
  const saveAuthRequest = useUpdateAuthRequest();
  const location = useLocation();

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

      navigate(RouteUrls.ChooseAccount);
    },
    [saveAuthRequest, navigate]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authRequest = urlParams.get('authRequest');
    if (authRequest) {
      saveAuthRequestParam(authRequest);
    }
  }, [location.search, saveAuthRequestParam]);
}
