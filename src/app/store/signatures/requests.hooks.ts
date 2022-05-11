import { verifySignatureRequest } from '@app/common/signature/requests';
import { useMemo } from 'react';
import { useAsync } from 'react-async-hook';
import { useSearchParams } from 'react-router-dom';
import { useAccounts } from '../accounts/account.hooks';

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

  return useMemo(
    () => ({
      requestToken: searchParams.get('request'),
      tabId: searchParams.get('tabId'),
      origin: searchParams.get('origin'),
      messageType: searchParams.get('messageType'),
    }),
    [searchParams]
  );
}
