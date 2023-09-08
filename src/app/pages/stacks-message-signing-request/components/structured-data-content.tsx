import { ChainID } from '@stacks/common';

import { StructuredMessageDataDomain } from '@shared/signature/signature-types';

import { getStructuredDataPayloadFromToken } from '@app/common/signature/requests';
import { NoFeesWarningRow } from '@app/components/no-fees-warning-row';
import { SignMessageActions } from '@app/features/message-signer/stacks-sign-message-action';

import { useStacksMessageSigner } from '../stacks-message-signing.utils';
import { StacksMessageSigningDisclaimer } from './message-signing-disclaimer';
import { StructuredDataBox } from './structured-data-box';

interface SignatureRequestStructuredDataContentProps {
  requestToken: string;
}
export function SignatureRequestStructuredDataContent({
  requestToken,
}: SignatureRequestStructuredDataContentProps) {
  const { isLoading, signMessage, cancelMessageSigning } = useStacksMessageSigner();
  const signatureRequest = getStructuredDataPayloadFromToken(requestToken);
  const { domain, message, network } = signatureRequest;
  const appName = signatureRequest.appDetails?.name;
  return (
    <>
      <StructuredDataBox message={message} domain={domain as StructuredMessageDataDomain} />
      <NoFeesWarningRow chainId={network?.chainId ?? ChainID.Testnet} />
      <SignMessageActions
        isLoading={isLoading}
        onSignMessageCancel={cancelMessageSigning}
        // #4164 FIXME fix type error on domain below
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onSignMessage={() => signMessage({ messageType: 'structured', message, domain })}
      />
      <hr />
      <StacksMessageSigningDisclaimer appName={appName} />
    </>
  );
}
