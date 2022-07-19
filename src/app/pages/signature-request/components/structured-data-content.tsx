import { getStructuredDataPayloadFromToken } from '@app/common/signature/requests';
import { SignatureMessageType } from '@shared/signature/types';
import { ChainID } from '@stacks/common';

import { Disclaimer } from './message-signing-disclaimer';
import { NetworkRow } from './network-row';
import { SignAction } from './sign-action';
import { StructuredDataBox } from './structured-data-box';

interface SignatureRequestStructuredDataContentProps {
  requestToken: string;
  messageType: SignatureMessageType;
}
export function SignatureRequestStructuredDataContent(
  props: SignatureRequestStructuredDataContentProps
) {
  const { requestToken, messageType } = props;
  const signatureRequest = getStructuredDataPayloadFromToken(requestToken);
  const { domain, message, network } = signatureRequest;
  const appName = signatureRequest.appDetails?.name;
  return (
    <>
      <StructuredDataBox message={message} domain={domain} />
      <NetworkRow chainId={network?.chainId ?? ChainID.Testnet} />
      <SignAction message={message} messageType={messageType} domain={domain} />
      <hr />
      <Disclaimer appName={appName} />
    </>
  );
}
