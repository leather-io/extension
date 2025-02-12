import { Outlet } from 'react-router-dom';

import { StacksNetwork } from '@stacks/network';
import type { ClarityValue } from '@stacks/transactions';

import {
  SignedMessageType,
  StructuredMessageDataDomain,
  UnsignedMessage,
  isSignableMessageType,
  isStructuredMessageType,
  isUtf8MessageType,
} from '@shared/signature/signature-types';
import { closeWindow } from '@shared/utils';

import { MessageSigningHeader } from '@app/features/message-signer/message-signing-header';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';

import { MessageSigningRequestLayout } from '../message-signer/message-signing-request.layout';
import { StacksSignatureRequestMessageContent } from './components/stacks-signature-message-content';
import { SignatureRequestStructuredDataContent } from './components/structured-data-content';

export interface Utf8Payload {
  messageType: 'utf8';
  message: string;
  network: StacksNetwork | undefined;
  appName: string | undefined | null;
}

export interface StructuredPayload {
  messageType: 'structured';
  message: ClarityValue;
  network: StacksNetwork | undefined;
  appName: string | undefined | null;
  domain: StructuredMessageDataDomain;
}

interface StacksMessageSigningProps {
  messageType: SignedMessageType;
  tabId: number | null;
  origin: string | null;
  isLoading: boolean;
  onSignMessage(unsignedMessage: UnsignedMessage): Promise<void>;
  onCancelMessageSigning(): void;
  payload: Utf8Payload | StructuredPayload;
}

export function StacksMessageSigning({
  messageType,
  tabId,
  origin,
  isLoading,
  onSignMessage,
  onCancelMessageSigning,
  payload,
}: StacksMessageSigningProps) {
  useOnOriginTabClose(() => closeWindow());

  if (!tabId) return null;
  if (!isSignableMessageType(messageType)) return null;
  if (!origin) return null;

  return (
    <MessageSigningRequestLayout>
      <MessageSigningHeader name={origin} origin={origin} />
      {isUtf8MessageType(messageType) && payload.messageType === 'utf8' && (
        <StacksSignatureRequestMessageContent
          isLoading={isLoading}
          onSignMessage={onSignMessage}
          onCancelMessageSigning={onCancelMessageSigning}
          payload={payload}
        />
      )}
      {isStructuredMessageType(messageType) && payload.messageType === 'structured' && (
        <SignatureRequestStructuredDataContent
          isLoading={isLoading}
          onSignMessage={onSignMessage}
          onCancelMessageSigning={onCancelMessageSigning}
          payload={payload}
        />
      )}
      <Outlet />
    </MessageSigningRequestLayout>
  );
}
