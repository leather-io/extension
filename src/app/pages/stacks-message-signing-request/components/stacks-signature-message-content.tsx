import { ChainID, bytesToHex } from '@stacks/common';
import { hashMessage } from '@stacks/encryption';

import { getSignaturePayloadFromToken } from '@app/common/signature/requests';
import { NoFeesWarningRow } from '@app/components/no-fees-warning-row';

import { MessagePreviewBox } from '../../../features/message-signer/message-preview-box';
import { SignMessageActions } from '../../../features/message-signer/stacks-sign-message-action';
import { useStacksMessageSigner } from '../stacks-message-signing.utils';
import { StacksMessageSigningDisclaimer } from './message-signing-disclaimer';

interface SignatureRequestMessageContentProps {
  requestToken: string;
}
export function StacksSignatureRequestMessageContent(props: SignatureRequestMessageContentProps) {
  const { requestToken } = props;
  const { isLoading, cancelMessageSigning, signMessage } = useStacksMessageSigner();
  const signatureRequest = getSignaturePayloadFromToken(requestToken);
  const { message, network } = signatureRequest;
  const appName = signatureRequest.appDetails?.name;
  return (
    <>
      <MessagePreviewBox message={message} hash={bytesToHex(hashMessage(message))} />
      <NoFeesWarningRow chainId={network?.chainId ?? ChainID.Testnet} />
      <SignMessageActions
        isLoading={isLoading}
        onSignMessageCancel={cancelMessageSigning}
        onSignMessage={() => signMessage({ messageType: 'utf8', message })}
      />
      <hr />
      <StacksMessageSigningDisclaimer appName={appName} />
    </>
  );
}
