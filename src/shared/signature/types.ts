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

export function isSignatureMessageType(messageType: unknown): messageType is SignatureMessageType {
  return typeof messageType === 'string' && ['utf8', 'structured'].includes(messageType);
}
