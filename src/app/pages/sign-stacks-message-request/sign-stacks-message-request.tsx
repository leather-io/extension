import { isSignableMessageType } from '@shared/signature/signature-types';

import { StacksMessageSigning } from '@app/features/stacks-message-signer/stacks-message-signing';
import {
  useSignStacksMessageRequest,
  useStacksMessageRequestPayload,
} from '@app/pages/sign-stacks-message-request/use-sign-stacks-message-request';
import { useSignatureRequestSearchParams } from '@app/store/signatures/requests.hooks';

export function SignStacksMessageRequest() {
  const { requestToken, messageType, tabId, origin } = useSignatureRequestSearchParams();
  const { isLoading, signMessage, onCancelMessageSigning } = useSignStacksMessageRequest();
  const payload = useStacksMessageRequestPayload();

  if (!requestToken || !tabId) return null;
  if (!isSignableMessageType(messageType)) return null;
  if (!origin) return null;
  if (!payload) return null;

  return (
    <StacksMessageSigning
      payload={payload}
      isLoading={isLoading}
      onSignMessage={signMessage}
      onCancelMessageSigning={onCancelMessageSigning}
      messageType={messageType}
      tabId={tabId}
      origin={origin}
    />
  );
}
