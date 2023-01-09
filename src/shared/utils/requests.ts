import { TransactionPayload } from '@stacks/connect';
import { decodeToken } from 'jsontokens';

export function getPayloadFromToken(requestToken: string) {
  const token = decodeToken(requestToken);
  return token.payload as unknown as TransactionPayload;
}
