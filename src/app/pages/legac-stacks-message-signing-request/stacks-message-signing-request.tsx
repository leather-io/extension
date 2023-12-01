import { isSignableMessageType } from '@shared/signature/signature-types';
import { closeWindow } from '@shared/utils';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import {
  getSignaturePayloadFromToken,
  getStructuredDataPayloadFromToken,
} from '@app/common/signature/requests';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { StacksMessageSigner } from '@app/features/stacks-message-signer/stacks-message-signer';
import { useStacksMessageSigner } from '@app/features/stacks-message-signer/stacks-message-signing.utils';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';

import { useLegacySignatureRequestSearchParams } from './stacks-message-signer.hooks';

export function StacksMessageLegacySigningRequest() {
  useRouteHeader(<PopupHeader />);
  useOnOriginTabClose(() => closeWindow());

  const { requestToken, messageType, tabId, origin } = useLegacySignatureRequestSearchParams();
  const { signMessage, cancelMessageSigning } = useStacksMessageSigner();
  if (!requestToken || !tabId || !origin || !isSignableMessageType(messageType)) return null;

  switch (messageType) {
    case 'utf8': {
      const plainMsgSignatureRequest = getSignaturePayloadFromToken(requestToken);
      const { message, network } = plainMsgSignatureRequest;
      const appName = plainMsgSignatureRequest.appDetails?.name;

      return (
        <StacksMessageSigner
          messageType="utf8"
          origin={origin}
          appName={appName}
          message={message}
          network={network}
          onSignMessage={() => signMessage({ messageType: 'utf8', message })}
          onSignMessageCancel={() => cancelMessageSigning()}
        />
      );
    }
    case 'structured': {
      const structuredDataRequest = getStructuredDataPayloadFromToken(requestToken);
      const { message, network, domain } = structuredDataRequest;
      return (
        <StacksMessageSigner
          messageType="structured"
          origin={origin}
          domain={domain}
          message={message}
          network={network}
          onSignMessage={() => signMessage({ messageType: 'structured', message, domain })}
          onSignMessageCancel={() => cancelMessageSigning()}
        />
      );
    }
  }
}
