import { CommonSignaturePayload, SignaturePayload } from '@stacks/connect';
import { deserializeCV } from '@stacks/transactions';
import { TokenInterface, decodeToken } from 'jsontokens';

import { StructuredMessageDataDomain } from '@shared/signature/signature-types';
import { isString } from '@shared/utils';

export function getGenericSignaturePayloadFromToken(requestToken: string): CommonSignaturePayload {
  const token = decodeToken(requestToken);
  return token.payload as unknown as CommonSignaturePayload;
}

export function getSignaturePayloadFromToken(requestToken: string): SignaturePayload {
  const token = decodeToken(requestToken);
  return token.payload as unknown as SignaturePayload;
}

export function getStructuredDataPayloadFromToken(requestToken: string) {
  const token = decodeToken(requestToken);
  if (isString(token.payload)) throw new Error('error decoding json token');

  const result = token.payload as unknown as TokenInterface & {
    message: string;
    domain: string;
  };

  return {
    ...(result as unknown as CommonSignaturePayload),
    message: deserializeCV(Buffer.from(result.message, 'hex')),
    domain: deserializeCV(Buffer.from(result.domain, 'hex')) as StructuredMessageDataDomain,
  };
}
