import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from 'jsontokens';

import { useUpdateAuthRequest } from '@app/store/onboarding/onboarding.hooks';
import { DecodedAuthRequest } from '@app/common/dev/types';
import { useInitialRouteSearchParams } from '@app/store/common/initial-route-search-params.hooks';
import { getRequestOrigin, StorageKey } from '@shared/utils/storage';
import { RouteUrls } from '@shared/route-urls';

export function useSaveAuthRequest() {
  const navigate = useNavigate();
  const saveAuthRequest = useUpdateAuthRequest();
  const [params] = useInitialRouteSearchParams();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const authRequest = params.get('authRequest');
    if (authRequest) {
      saveAuthRequestParam(authRequest);
    }
  }, [params, saveAuthRequestParam]);
}
