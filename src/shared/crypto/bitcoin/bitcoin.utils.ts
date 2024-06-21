import type { TransactionInput } from '@scure/btc-signer/psbt';

import { isDefined } from '@leather.io/utils';

import { logger } from '@shared/logger';

export function getBitcoinInputValue(input: TransactionInput) {
  if (isDefined(input.witnessUtxo)) return Number(input.witnessUtxo.amount);
  if (isDefined(input.nonWitnessUtxo) && isDefined(input.index))
    return Number(input.nonWitnessUtxo.outputs[input.index]?.amount);
  logger.warn('Unable to find either `witnessUtxo` or `nonWitnessUtxo` in input. Defaulting to 0');
  return 0;
}
