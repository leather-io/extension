import { useEffect, useMemo } from 'react';
import { useAsync } from 'react-async-hook';
import { useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';

import { verifySignatureRequest } from '@app/common/signature/requests';
import { useAccounts } from '@app/store/accounts/account.hooks';
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
  const [searchParams] = useSearchParams();
  const { origin, tabId } = useDefaultRequestParams();

  return useMemo(
    () => ({
      origin,
      tabId,
      requestToken: searchParams.get('request'),
      messageType: searchParams.get('messageType'),
    }),
    [origin, searchParams, tabId]
  );
}
