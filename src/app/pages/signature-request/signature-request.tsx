import { memo } from 'react';

import { isUndefined } from '@shared/utils';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { PopupHeader } from '@app/features/current-account/popup-header';
import {
  isSignatureMessageType,
  isStructuredMessage,
  isUtf8Message,
} from '@shared/signature/types';
import {
  useIsSignatureRequestValid,
  useSetAtomSignatureRequestToken,
  useSignatureRequestSearchParams,
} from '@app/store/signatures/requests.hooks';

import { ErrorMessage } from './components/message-signing-error-msg';
import { SignatureRequestStructuredDataContent } from './components/structured-data-content';
import { SignatureRequestMessageContent } from './components/message-content';
import { SignatureRequestLayout } from './components/signature-request.layout';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';

function SignatureRequestBase() {
  const validSignatureRequest = useIsSignatureRequestValid();
  const { requestToken, messageType } = useSignatureRequestSearchParams();

  useRouteHeader(<PopupHeader />);

  useOnOriginTabClose(() => window.close());

  // Temporary workaround to avoid pattern of pulling search params directly
  // into an atom, rather than using the tooling provided by our router library
  useSetAtomSignatureRequestToken(requestToken);

  if (!isSignatureMessageType(messageType)) return null;
  if (isUndefined(validSignatureRequest)) return null;
  if (!requestToken || !messageType) return null;

  if (!validSignatureRequest)
    return (
      <SignatureRequestLayout>
        <ErrorMessage errorMessage="Invalid signature request" />
      </SignatureRequestLayout>
    );

  return (
    <SignatureRequestLayout>
      {isStructuredMessage(messageType) && (
        <SignatureRequestStructuredDataContent
          requestToken={requestToken}
          messageType={messageType}
        />
      )}
      {isUtf8Message(messageType) && (
        <SignatureRequestMessageContent requestToken={requestToken} messageType={messageType} />
      )}
    </SignatureRequestLayout>
  );
}

export const SignatureRequest = memo(SignatureRequestBase);
