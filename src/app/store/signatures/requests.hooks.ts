import { useCallback, useMemo } from 'react';
import { useAsync } from 'react-async-hook';
import { useSearchParams } from 'react-router-dom';

import { finalizeMessageSignature } from '@app/common/actions/finalize-message-signature';
import { verifySignatureRequest } from '@app/common/signature/requests';
import { useAccounts } from '@app/store/accounts/account.hooks';

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

export function useOnCancelSignMessage() {
  const { requestToken, tabId } = useSignatureRequestSearchParams();

  return useCallback(() => {
    if (!requestToken || !tabId) return;
    const tabIdInt = parseInt(tabId);
    const data = 'cancel';
    finalizeMessageSignature(requestToken, tabIdInt, data);
  }, [requestToken, tabId]);
}
