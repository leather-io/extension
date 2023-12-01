import { ChainID } from '@stacks/common';
import { StacksNetwork } from '@stacks/network';
import { ClarityValue } from '@stacks/transactions';

import { StructuredMessageDataDomain } from '@shared/signature/signature-types';

import { NoFeesWarningRow } from '@app/components/no-fees-warning-row';
import { SignMessageActions } from '@app/features/message-signer/sign-message-actions';

import { StacksMessageSigningDisclaimer } from './message-signing-disclaimer';
import { StructuredDataBox } from './structured-data-box';

interface StacksMsgSignignStructuredDataContentProps {
  message: ClarityValue;
  domain: StructuredMessageDataDomain;
  appName?: string;
  network?: StacksNetwork;
  onSignMessage(): void;
  onSignMessageCancel(): void;
}
export function StacksMsgSigningStructuredDataContent(
  props: StacksMsgSignignStructuredDataContentProps
) {
  const { message, domain, network, appName, onSignMessage, onSignMessageCancel } = props;
  return (
    <>
      <StructuredDataBox message={message} domain={domain} />
      <NoFeesWarningRow chainId={network?.chainId ?? ChainID.Testnet} />
      <SignMessageActions
        isLoading={false}
        onSignMessageCancel={onSignMessageCancel}
        onSignMessage={onSignMessage}
      />
      <hr />
      <StacksMessageSigningDisclaimer appName={appName} />
    </>
  );
}
