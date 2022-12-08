import { ClarityValue, TupleCV } from '@stacks/transactions';

import { isString } from '@shared/utils';

type SignedMessageType = 'utf8' | 'structured';

interface AbstractSignedMessage {
  messageType: SignedMessageType;
}

interface SignedMessageUtf8 extends AbstractSignedMessage {
  messageType: 'utf8';
  message: string;
}

interface SignedMessageStructured extends AbstractSignedMessage {
  messageType: 'structured';
  message: ClarityValue;
  domain: TupleCV;
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

type WhenSignedMessageTypeArgs<T> = Record<SignedMessageType, T>;
export function whenSignedMessageType(msgType: SignedMessageType) {
  return <T>(arg: WhenSignedMessageTypeArgs<T>) => arg[msgType];
}

interface WhenSignedMessageArgs {
  utf8(message: string): void;
  structured(domain: TupleCV, message: ClarityValue): void;
}
export function whenSignedMessage(msg: SignedMessage) {
  return ({ utf8, structured }: WhenSignedMessageArgs) => {
    if (msg.messageType === 'utf8') utf8(msg.message);
    if (msg.messageType === 'structured') structured(msg.domain, msg.message);
  };
}

export function inferSignedMessageType(
  message: string | ClarityValue,
  domain?: TupleCV
): SignedMessageType {
  if (!domain && isString(message)) return 'utf8';
  return 'structured';
}
