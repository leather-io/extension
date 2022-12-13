import { ChainID } from '@stacks/common';

import { getSignaturePayloadFromToken } from '@app/common/signature/requests';

import { MessageBox } from './message-box';
import { Disclaimer } from './message-signing-disclaimer';
import { NetworkRow } from './network-row';
import { SignAction } from './sign-action';

interface SignatureRequestMessageContentProps {
  requestToken: string;
}
export function SignatureRequestMessageContent(props: SignatureRequestMessageContentProps) {
  const { requestToken } = props;

  const signatureRequest = getSignaturePayloadFromToken(requestToken);
  const { message, network } = signatureRequest;
  const appName = signatureRequest.appDetails?.name;
  return (
    <>
      <MessageBox message={message} />
      <NetworkRow chainId={network?.chainId ?? ChainID.Testnet} />
      <SignAction message={message} messageType="utf8" />
      <hr />
      <Disclaimer appName={appName} />
    </>
  );
}
