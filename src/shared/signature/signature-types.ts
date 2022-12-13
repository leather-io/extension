import { ClarityValue, StringAsciiCV, TupleCV, UIntCV } from '@stacks/transactions';

type SignedMessageType = 'utf8' | 'structured';

export type StructuredMessageDataDomain = TupleCV<{
  name: StringAsciiCV;
  version: StringAsciiCV;
  'chain-id': UIntCV;
}>;

interface AbstractSignedMessage {
  messageType: SignedMessageType;
}

interface SignedMessageUtf8 extends AbstractSignedMessage {
  messageType: 'utf8';
  message: string;
}

export interface SignedMessageStructured extends AbstractSignedMessage {
  messageType: 'structured';
  message: ClarityValue;
  domain: StructuredMessageDataDomain;
}

export type SignedMessage = SignedMessageUtf8 | SignedMessageStructured;

export function isStructuredMessageType(
  messageType: SignedMessageType
): messageType is 'structured' {
  return messageType === 'structured';
}

export function isUtf8MessageType(messageType: SignedMessageType): messageType is 'utf8' {
  return messageType === 'utf8';
}

export function isSignedMessageType(messageType: unknown): messageType is SignedMessageType {
  return typeof messageType === 'string' && ['utf8', 'structured'].includes(messageType);
}

interface WhenSignedMessageOfType<T> {
  utf8(message: string): T;
  structured(domain: StructuredMessageDataDomain, message: ClarityValue): T;
}
export function whenSignedMessageOfType(msg: SignedMessage) {
  return <T>({ utf8, structured }: WhenSignedMessageOfType<T>) => {
    if (msg.messageType === 'utf8') return utf8(msg.message);
    if (msg.messageType === 'structured') return structured(msg.domain, msg.message);
    throw new Error('Message can only be either `utf8` or `structured`');
  };
}
