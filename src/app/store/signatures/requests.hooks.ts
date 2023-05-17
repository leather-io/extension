import { useMemo } from 'react';
import { useAsync } from 'react-async-hook';

import { SignedMessageType } from '@shared/signature/signature-types';
import { isString } from '@shared/utils';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { initialSearchParams } from '@app/common/initial-search-params';
import {
  getGenericSignaturePayloadFromToken,
  verifySignatureRequest,
} from '@app/common/signature/requests';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function useSignatureRequestSearchParams() {
  const { origin, tabId } = useDefaultRequestParams();

  return useMemo(() => {
    const requestToken = initialSearchParams.get('request');
    const messageType = initialSearchParams.get('messageType') as SignedMessageType;

    return {
      tabId: isString(tabId) ? parseInt(tabId, 10) : tabId,
      requestToken,
      origin,
      messageType,
    };
  }, [origin, tabId]);
}

function useSignatureRequestState() {
  const { requestToken } = useSignatureRequestSearchParams();
  return useMemo(() => {
    if (!requestToken) return null;
    return getGenericSignaturePayloadFromToken(requestToken);
  }, [requestToken]);
}

export function useSignatureRequestAccountIndex() {
  const signaturePayload = useSignatureRequestState();
  const accounts = useStacksAccounts();

  if (!signaturePayload?.stxAddress) return;
  const { stxAddress } = signaturePayload;

  if (stxAddress && accounts) {
    return accounts.findIndex(account => account.address === stxAddress); // selected account
  }
  return undefined;
}

export function useIsSignatureRequestValid() {
  const accounts = useStacksAccounts();
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
