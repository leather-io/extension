import { decodeToken } from 'jsontokens';
import type { TransactionPayload } from '@stacks/connect';

export function getPayloadFromToken(requestToken: string) {
  const token = decodeToken(requestToken);
  return token.payload as unknown as TransactionPayload;
}

export function isSendingFormSendingStx(assetId?: string) {
  return assetId === '.::Stacks Token';
}
