import { useMemo } from 'react';

import { decodeToken } from 'jsontokens';

import { DecodedAuthRequest } from '@shared/models/decoded-auth-request';

import { initialSearchParams } from '@app/common/initial-search-params';

import { useDefaultRequestParams } from '../use-default-request-search-params';

function parseAuthRequestValues(authRequest: string | null, origin: string | null) {
  if (!authRequest || !origin) return;

  const { payload } = decodeToken(authRequest);
  const decodedAuthRequest = payload as unknown as DecodedAuthRequest;

  const appName = decodedAuthRequest.appDetails?.name;
  const appIcon = decodedAuthRequest.appDetails?.icon;

  if (!appIcon) throw new Error('Missing `appIcon` from auth request');
  if (!appName) throw new Error('Missing `appName` from auth request');

  return {
    decodedAuthRequest,
    authRequest,
    appName,
    appIcon,
    appURL: new URL(origin),
  };
}

export function useAuthRequestParams() {
  const { origin, tabId } = useDefaultRequestParams();

  return useMemo(() => {
    const authRequest = initialSearchParams.get('authRequest');
    const authDetails = parseAuthRequestValues(authRequest, origin);

    return { origin, tabId, authRequest, authDetails };
  }, [origin, tabId]);
}
