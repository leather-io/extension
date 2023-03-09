import { useMemo } from 'react';
import { useAsync } from 'react-async-hook';
import { useSearchParams } from 'react-router-dom';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { verifyPsbtRequest } from '@app/common/psbt/requests';

import { useStacksAccounts } from '../accounts/blockchain/stacks/stacks-account.hooks';

export function usePsbtRequestSearchParams() {
  const [searchParams] = useSearchParams();
  const { origin, tabId } = useDefaultRequestParams();
  const requestToken = searchParams.get('request');
  return useMemo(
    () => ({
      origin,
      tabId: tabId ?? 1,
      requestToken,
    }),
    [origin, requestToken, tabId]
  );
}

export function useIsPsbtRequestValid() {
  const accounts = useStacksAccounts();
  const { origin, requestToken } = usePsbtRequestSearchParams();

  return useAsync(async () => {
    if (typeof accounts === 'undefined') return;
    if (!origin || !accounts || !requestToken) return;
    try {
      const payload = await verifyPsbtRequest({
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
