import { memo } from 'react';
import { Outlet } from 'react-router-dom';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { PopupHeader } from '@app/features/current-account/popup-header';
import {
  isSignatureMessageType,
  isStructuredMessage,
  isUtf8Message,
} from '@shared/signature/types';
import {
  useIsSignatureRequestValid,
  useSignatureRequestSearchParams,
} from '@app/store/signatures/requests.hooks';
import { WarningLabel } from '@app/components/warning-label';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';

import { SignatureRequestStructuredDataContent } from './components/structured-data-content';
import { SignatureRequestMessageContent } from './components/message-content';
import { SignatureRequestLayout } from './components/signature-request.layout';

function SignatureRequestBase() {
  const validSignatureRequest = useIsSignatureRequestValid();
  const { requestToken, messageType } = useSignatureRequestSearchParams();

  useRouteHeader(<PopupHeader />);

  useOnOriginTabClose(() => window.close());

  if (!isSignatureMessageType(messageType)) return null;

  if (!requestToken || !messageType) return null;

  return (
    <SignatureRequestLayout>
      {!validSignatureRequest && (
        <WarningLabel>
          Signing messages can have unintended consequences. Only sign messages from trusted
          sources.
        </WarningLabel>
      )}
      {isUtf8Message(messageType) && (
        <SignatureRequestMessageContent requestToken={requestToken} messageType={messageType} />
      )}
      {isStructuredMessage(messageType) && (
        <SignatureRequestStructuredDataContent
          requestToken={requestToken}
          messageType={messageType}
        />
      )}
      <Outlet />
    </SignatureRequestLayout>
  );
}

export const SignatureRequest = memo(SignatureRequestBase);
