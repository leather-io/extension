import { Outlet } from 'react-router-dom';

import {
  isSignableMessageType,
  isStructuredMessageType,
  isUtf8MessageType,
} from '@shared/signature/signature-types';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { MessageSigningHeader } from '@app/features/message-signer/message-signing-header';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { useSignatureRequestSearchParams } from '@app/store/signatures/requests.hooks';

import { MessageSigningRequestLayout } from '../../features/message-signer/message-signing-request.layout';
import { StacksSignatureRequestMessageContent } from './components/stacks-signature-message-content';
import { SignatureRequestStructuredDataContent } from './components/structured-data-content';

export function StacksMessageSigningRequest() {
  useRouteHeader(<PopupHeader />);
  useOnOriginTabClose(() => window.close());

  const { requestToken, messageType, tabId, origin } = useSignatureRequestSearchParams();

  if (!requestToken || !tabId) return null;
  if (!isSignableMessageType(messageType)) return null;
  if (!origin) return null;

  return (
    <MessageSigningRequestLayout>
      <MessageSigningHeader name={origin} origin={origin} />

      {isUtf8MessageType(messageType) && (
        <StacksSignatureRequestMessageContent requestToken={requestToken} />
      )}
      {isStructuredMessageType(messageType) && (
        <SignatureRequestStructuredDataContent requestToken={requestToken} />
      )}
      <Outlet />
    </MessageSigningRequestLayout>
  );
}
