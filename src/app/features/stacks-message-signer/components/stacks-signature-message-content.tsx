import { ChainID, bytesToHex } from '@stacks/common';
import { hashMessage } from '@stacks/encryption';
import { StacksNetwork } from '@stacks/network';

import { NoFeesWarningRow } from '@app/components/no-fees-warning-row';

import { MessagePreviewBox } from '../../message-signer/message-preview-box';
import { SignMessageActions } from '../../message-signer/sign-message-actions';
import { StacksMessageSigningDisclaimer } from './message-signing-disclaimer';

interface SignatureRequestMessageContentProps {
  appName?: string;
  network?: StacksNetwork;
  message: string;
  onSignMessage(): void;
  onSignMessageCancel(): void;
}
export function StacksSignatureRequestMessageContent(props: SignatureRequestMessageContentProps) {
  const { appName, network, message, onSignMessage, onSignMessageCancel } = props;

  return (
    <>
      <MessagePreviewBox message={message} hash={bytesToHex(hashMessage(message))} />
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
