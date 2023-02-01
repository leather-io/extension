import { useMemo } from 'react';
import { useAsync } from 'react-async-hook';
import { useSearchParams } from 'react-router-dom';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { verifyProfileUpdateRequest } from '@app/common/profiles/requests';

import { useStacksAccounts } from '../accounts/blockchain/stacks/stacks-account.hooks';

export function useIsProfileUpdateRequestValid() {
  const accounts = useStacksAccounts();
  const { origin, requestToken } = useProfileUpdateRequestSearchParams();

  return useAsync(async () => {
    if (typeof accounts === 'undefined') return;
    if (!origin || !accounts || !requestToken) return;
    try {
      const payload = await verifyProfileUpdateRequest({
        requestToken,
        accounts,
        appDomain: origin,
      });
      return !!payload;
    } catch (e) {
      return false;
    }
  }, [accounts, requestToken, origin]).result;
}

export function useProfileUpdateRequestSearchParams() {
  const [searchParams] = useSearchParams();
  const { origin, tabId } = useDefaultRequestParams();
  const requestToken = searchParams.get('request');
  return useMemo(
    () => ({
      origin,
      tabId: tabId || 1,
      requestToken,
    }),
    [origin, requestToken, tabId]
  );
}
