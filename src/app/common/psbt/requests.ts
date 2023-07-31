import * as btc from '@scure/btc-signer';
import { PsbtPayload } from '@stacks/connect';
import { decodeToken } from 'jsontokens';

import { Money } from '@shared/models/money.model';
import { isString } from '@shared/utils';

export interface SignPsbtArgs {
  addressNativeSegwitTotal?: Money;
  addressTaprootTotal?: Money;
  fee?: Money;
  inputs: btc.TransactionInput[];
}

export function getPsbtPayloadFromToken(requestToken: string): PsbtPayload {
  const token = decodeToken(requestToken);
  if (isString(token.payload)) throw new Error('Error decoding json token');
  return token.payload as unknown as PsbtPayload;
}
