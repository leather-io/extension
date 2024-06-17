import { finalizeMessageSignature } from '@shared/actions/finalize-message-signature';
import { isStructuredMessageType, isUtf8MessageType } from '@shared/signature/signature-types';
import { analytics } from '@shared/utils/analytics';

import {
  getSignaturePayloadFromToken,
  getStructuredDataPayloadFromToken,
} from '@app/common/signature/requests';
import {
  StructuredPayload,
  Utf8Payload,
} from '@app/features/stacks-message-signer/stacks-message-signing';
import { useSignStacksMessage } from '@app/features/stacks-message-signer/use-sign-stacks-message';
import { useSignatureRequestSearchParams } from '@app/store/signatures/requests.hooks';

export function useStacksMessageRequestPayload() {
  const { requestToken, messageType } = useSignatureRequestSearchParams();

  if (!requestToken) return null;

  if (isUtf8MessageType(messageType)) {
    const signatureRequest = getSignaturePayloadFromToken(requestToken);
    const { message, network } = signatureRequest;
    const appName = signatureRequest.appDetails?.name;
    return {
      messageType: 'utf8' as const,
      message,
      network,
      appName,
    } satisfies Utf8Payload;
  }
  if (isStructuredMessageType(messageType)) {
    const signatureRequest = getStructuredDataPayloadFromToken(requestToken);
    const { message, network, domain } = signatureRequest;
    const appName = signatureRequest.appDetails?.name;
    return {
      messageType: 'structured' as const,
      message,
      network,
      appName,
      domain,
    } satisfies StructuredPayload;
  }
  return null;
}

export function useSignStacksMessageRequest() {
  const { requestToken, tabId } = useSignatureRequestSearchParams();
  if (!tabId) throw new Error('Requests can only be made with corresponding tab');
  if (!requestToken) throw new Error('Missing request token');

  const { isLoading, signMessage } = useSignStacksMessage({
    onSignMessageCompleted: messageSignature => {
      finalizeMessageSignature({ requestPayload: requestToken, tabId, data: messageSignature });
    },
    onSignMessageCancelled: onCancelMessageSigning,
  });

  function onCancelMessageSigning() {
    if (!requestToken || !tabId) return;
    void analytics.track('request_signature_cancel');
    finalizeMessageSignature({ requestPayload: requestToken, tabId, data: 'cancel' });
  }

  return { isLoading, signMessage, onCancelMessageSigning };
}
