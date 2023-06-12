import { PsbtPayload } from '@stacks/connect';
import { decodeToken } from 'jsontokens';

import { isString } from '@shared/utils';

export function getPsbtPayloadFromToken(requestToken: string): PsbtPayload {
  const token = decodeToken(requestToken);
  if (isString(token.payload)) throw new Error('Error decoding json token');
  return token.payload as unknown as PsbtPayload;
}
