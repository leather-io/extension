import { useCallback, useMemo } from 'react';
import { useAsync } from 'react-async-hook';
import { useSearchParams } from 'react-router-dom';

import { finalizeMessageSignature } from '@app/common/actions/finalize-message-signature';
import { verifySignatureRequest } from '@app/common/signature/requests';
import { useAccounts } from '@app/store/accounts/account.hooks';
import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';

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

export function useOnCancelSignMessage() {
  const { requestToken, tabId } = useSignatureRequestSearchParams();

  return useCallback(() => {
    if (!requestToken || !tabId) return;
    const data = 'cancel';
    finalizeMessageSignature({ requestPayload: requestToken, tabId, data });
  }, [requestToken, tabId]);
}
