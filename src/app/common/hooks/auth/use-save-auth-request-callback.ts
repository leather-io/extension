import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from 'jsontokens';

import { useUpdateAuthRequest } from '@app/store/onboarding/onboarding.hooks';
import { DecodedAuthRequest } from '@shared/models/decoded-auth-request';

import { RouteUrls } from '@shared/route-urls';
import { useAuthRequestParams } from './use-auth-request-params';

export function useSaveAuthRequest() {
  const navigate = useNavigate();
  const saveAuthRequest = useUpdateAuthRequest();
  const { origin, authRequest } = useAuthRequestParams();

  const saveAuthRequestParam = useCallback(
    (authRequest: string, origin: string) => {
      const { payload } = decodeToken(authRequest);
      const decodedAuthRequest = payload as unknown as DecodedAuthRequest;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (authRequest && origin) saveAuthRequestParam(authRequest, origin);
  }, [authRequest, origin, saveAuthRequestParam]);
}
