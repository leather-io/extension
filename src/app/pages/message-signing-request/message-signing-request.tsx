import { Outlet } from 'react-router-dom';

import {
  isSignedMessageType,
  isStructuredMessageType,
  isUtf8MessageType,
} from '@shared/signature/signature-types';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { WarningLabel } from '@app/components/warning-label';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import {
  useIsSignatureRequestValid,
  useSignatureRequestSearchParams,
} from '@app/store/signatures/requests.hooks';

import { SignatureRequestMessageContent } from './components/message-content';
import { MessageSigningRequestLayout } from './components/signature-request.layout';
import { SignatureRequestStructuredDataContent } from './components/structured-data-content';

export function MessageSigningRequest() {
  const validSignatureRequest = useIsSignatureRequestValid();
  const { requestToken, messageType } = useSignatureRequestSearchParams();

  useRouteHeader(<PopupHeader />);

  useOnOriginTabClose(() => window.close());

  if (!isSignedMessageType(messageType)) return null;

  if (!requestToken || !messageType) return null;

  return (
    <MessageSigningRequestLayout>
      {!validSignatureRequest && (
        <WarningLabel>
          Signing messages can have unintended consequences. Only sign messages from trusted
          sources.
        </WarningLabel>
      )}
      {isUtf8MessageType(messageType) && (
        <SignatureRequestMessageContent requestToken={requestToken} />
      )}
      {isStructuredMessageType(messageType) && (
        <SignatureRequestStructuredDataContent requestToken={requestToken} />
      )}
      <Outlet />
    </MessageSigningRequestLayout>
  );
}
