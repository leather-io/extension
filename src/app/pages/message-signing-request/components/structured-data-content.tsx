import { ChainID } from '@stacks/common';

import { getStructuredDataPayloadFromToken } from '@app/common/signature/requests';

import { Disclaimer } from './message-signing-disclaimer';
import { NetworkRow } from './network-row';
import { SignAction } from './sign-action';
import { StructuredDataBox } from './structured-data-box';

interface SignatureRequestStructuredDataContentProps {
  requestToken: string;
}
export function SignatureRequestStructuredDataContent({
  requestToken,
}: SignatureRequestStructuredDataContentProps) {
  const signatureRequest = getStructuredDataPayloadFromToken(requestToken);
  const { domain, message, network } = signatureRequest;
  const appName = signatureRequest.appDetails?.name;
  return (
    <>
      <StructuredDataBox message={message} domain={domain} />
      <NetworkRow chainId={network?.chainId ?? ChainID.Testnet} />
      <SignAction message={message} messageType="structured" domain={domain} />
      <hr />
      <Disclaimer appName={appName} />
    </>
  );
}
