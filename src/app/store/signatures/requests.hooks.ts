import { useEffect, useMemo } from 'react';
import { useAsync } from 'react-async-hook';
import { useAtom } from 'jotai';

import { verifySignatureRequest } from '@app/common/signature/requests';
import { useAccounts } from '@app/store/accounts/account.hooks';
import { useInitialRouteSearchParams } from '../common/initial-route-search-params.hooks';
import { isString } from '@shared/utils';
import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { signatureRequestToken } from './requests';

export function useSetAtomSignatureRequestToken(requestToken: null | string) {
  const [_, setTokenValue] = useAtom(signatureRequestToken);

  useEffect(() => {
    if (requestToken) setTokenValue(requestToken);
  }, [requestToken, setTokenValue]);
}

export function useIsSignatureRequestValid() {
  const accounts = useAccounts();
  const { origin, requestToken } = useSignatureRequestSearchParams();

  return useAsync(async () => {
    if (typeof accounts === 'undefined') return;
    if (!origin || !accounts || !requestToken) return;
    try {
      const valid = await verifySignatureRequest({
        requestToken,
        accounts,
        appDomain: origin,
      });
      return !!valid;
    } catch (e) {
      return false;
    }
  }, [accounts, requestToken, origin]).result;
}

export function useSignatureRequestSearchParams() {
  const searchParams = useInitialRouteSearchParams();
  const { origin, tabId } = useDefaultRequestParams();

  return useMemo(() => {
    const requestToken = searchParams.get('request');

    const messageType = searchParams.get('messageType');

    return {
      tabId: isString(tabId) ? parseInt(tabId, 10) : tabId,
      requestToken,
      origin,
      messageType,
    };
  }, [origin, searchParams, tabId]);
}
