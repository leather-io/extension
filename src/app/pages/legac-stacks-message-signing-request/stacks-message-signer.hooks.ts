import { useMemo } from 'react';

import { SignedMessageType } from '@shared/signature/signature-types';
import { isString } from '@shared/utils';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { initialSearchParams } from '@app/common/initial-search-params';
import { getGenericSignaturePayloadFromToken } from '@app/common/signature/requests';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function useLegacySignatureRequestSearchParams() {
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
  const { requestToken } = useLegacySignatureRequestSearchParams();
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
