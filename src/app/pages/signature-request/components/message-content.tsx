import { getSignaturePayloadFromToken } from '@app/common/signature/requests';
import { SignatureMessageType } from '@shared/signature/types';
import { ChainID } from '@stacks/common';
import { MessageBox } from './message-box';
import { Disclaimer } from './message-signing-disclaimer';
import { NetworkRow } from './network-row';
import { SignAction } from './sign-action';

interface SignatureRequestMessageContentProps {
  requestToken: string;
  messageType: SignatureMessageType;
}
export function SignatureRequestMessageContent(props: SignatureRequestMessageContentProps) {
  const { requestToken, messageType } = props;

  const signatureRequest = getSignaturePayloadFromToken(requestToken);
  const { message, network } = signatureRequest;
  const appName = signatureRequest.appDetails?.name;
  return (
    <>
      <MessageBox message={message} />
      <NetworkRow chainId={network?.chainId ?? ChainID.Testnet} />
      <SignAction message={message} messageType={messageType} />
      <hr />
      <Disclaimer appName={appName} />
    </>
  );
}
