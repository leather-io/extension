import { ClarityValue, TupleCV } from '@stacks/transactions';

export type SignatureMessageType = 'utf8' | 'structured';

export interface SignatureMessage {
  message: string | ClarityValue;
  domain?: TupleCV | undefined;
  messageType: SignatureMessageType;
}

export function isStructuredMessage(
  messageType: SignatureMessageType
): messageType is 'structured' {
  return messageType === 'structured';
}
export function isUtf8Message(messageType: SignatureMessageType): messageType is 'utf8' {
  return messageType === 'utf8';
}

export function isSignatureMessageType(messageType: unknown): messageType is SignatureMessageType {
  return typeof messageType === 'string' && ['utf8', 'structured'].includes(messageType);
}
