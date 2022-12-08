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

interface WhenSigningMessageArgs<T> {
  utf8(message: string): Promise<T> | T;
  structured(domain: StructuredMessageDataDomain, message: ClarityValue): Promise<T> | T;
}
export function whenSignedMessageOfType<T>(msg: SignedMessage) {
  return ({ utf8, structured }: WhenSigningMessageArgs<T | Promise<T>>) => {
    if (msg.messageType === 'utf8') return utf8(msg.message);
    if (msg.messageType === 'structured') return structured(msg.domain, msg.message);
    throw new Error('Message can only be either `utf8` or `structured`');
  };
}
