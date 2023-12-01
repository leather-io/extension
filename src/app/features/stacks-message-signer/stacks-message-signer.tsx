import { Outlet } from 'react-router-dom';

import { StacksNetwork } from '@stacks/network';
import { ClarityValue } from '@stacks/transactions';

import { StructuredMessageDataDomain } from '@shared/signature/signature-types';

import { MessageSigningHeader } from '../message-signer/message-signing-header';
import { MessageSigningRequestLayout } from '../message-signer/message-signing-request.layout';
import { StacksSignatureRequestMessageContent } from './components/stacks-signature-message-content';
import { StacksMsgSigningStructuredDataContent } from './components/structured-data-content';

interface StacksMessageSignerBaseProps {
  messageType: 'utf8' | 'structured';
  origin: string;
  network?: StacksNetwork;
  appName?: string;
  onSignMessage(): void;
  onSignMessageCancel(): void;
}
interface StacksUtf8MessageSignerProps extends StacksMessageSignerBaseProps {
  messageType: 'utf8';
  message: string;
}
interface StacksStructuredMessageSignerProps extends StacksMessageSignerBaseProps {
  messageType: 'structured';
  message: ClarityValue;
  domain: StructuredMessageDataDomain;
}
type StacksMessageSignerProps = StacksUtf8MessageSignerProps | StacksStructuredMessageSignerProps;
export function StacksMessageSigner(props: StacksMessageSignerProps) {
  const { messageType, origin, message, network, onSignMessage, onSignMessageCancel } = props;

  return (
    <MessageSigningRequestLayout>
      <MessageSigningHeader name={origin} origin={origin} />

      {messageType === 'utf8' && (
        <StacksSignatureRequestMessageContent
          message={message}
          network={network}
          onSignMessage={onSignMessage}
          onSignMessageCancel={onSignMessageCancel}
        />
      )}

      {messageType === 'structured' && (
        <StacksMsgSigningStructuredDataContent
          message={message}
          domain={props.domain}
          network={network}
          onSignMessage={onSignMessage}
          onSignMessageCancel={onSignMessageCancel}
        />
      )}

      <Outlet />
    </MessageSigningRequestLayout>
  );
}
