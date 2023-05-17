import { ClarityValue, StringAsciiCV, TupleCV, UIntCV } from '@stacks/transactions';

export type SignedMessageType = 'utf8' | 'structured';

export type StructuredMessageDataDomain = TupleCV<{
  name: StringAsciiCV;
  version: StringAsciiCV;
  'chain-id': UIntCV;
}>;

interface AbstractUnsignedMessage {
  messageType: SignedMessageType;
}

interface UnsignedMessageUtf8 extends AbstractUnsignedMessage {
  messageType: 'utf8';
  message: string;
}

export interface UnsignedMessageStructured extends AbstractUnsignedMessage {
  messageType: 'structured';
  message: ClarityValue;
  domain: StructuredMessageDataDomain;
}

export type UnsignedMessage = UnsignedMessageUtf8 | UnsignedMessageStructured;

export function isStructuredMessageType(
  messageType: SignedMessageType
): messageType is 'structured' {
  return messageType === 'structured';
}

export function isUtf8MessageType(messageType: SignedMessageType): messageType is 'utf8' {
  return messageType === 'utf8';
}

export function isSignableMessageType(messageType: unknown): messageType is SignedMessageType {
  return typeof messageType === 'string' && ['utf8', 'structured'].includes(messageType);
}

interface WhenSignableMessageOfType<T> {
  utf8(message: string): T;
  structured(domain: StructuredMessageDataDomain, message: ClarityValue): T;
}
export function whenSignableMessageOfType(msg: UnsignedMessage) {
  return <T>({ utf8, structured }: WhenSignableMessageOfType<T>) => {
    if (msg.messageType === 'utf8') return utf8(msg.message);
    return structured(msg.domain, msg.message);
  };
}
