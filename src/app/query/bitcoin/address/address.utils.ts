import { isEmptyArray } from '@shared/utils';

import { UtxoResponseItem } from '../bitcoin-client';

export function hasInscriptions(utxos: UtxoResponseItem[]) {
  return !isEmptyArray(utxos);
}
