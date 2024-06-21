import * as btc from '@scure/btc-signer';

import {
  getInputPaymentType,
  getNativeSegwitAddressIndexDerivationPath,
  getTaprootAddressIndexDerivationPath,
} from '@leather.io/bitcoin';
import type { BitcoinNetworkModes } from '@leather.io/models';
import { isUndefined, makeNumberRange } from '@leather.io/utils';

import { logger } from '@shared/logger';

// Used to pass to a signing function, with info needed for determine which key
// to use to sign a given input
export interface BitcoinInputSigningConfig {
  derivationPath: string;
  index: number;
}

interface GetAssumedZeroIndexSigningConfigArgs {
  psbt: Uint8Array;
  network: BitcoinNetworkModes;
  indexesToSign?: number[];
}
export function getAssumedZeroIndexSigningConfig({
  psbt,
  network,
  indexesToSign,
}: GetAssumedZeroIndexSigningConfigArgs) {
  const tx = btc.Transaction.fromPSBT(psbt);
  const indexes = indexesToSign ?? makeNumberRange(tx.inputsLength);
  return {
    forAccountIndex(accountIndex: number): BitcoinInputSigningConfig[] {
      return indexes.map(inputIndex => {
        const input = tx.getInput(inputIndex);

        if (isUndefined(input.index)) throw new Error('Input must have an index for payment type');
        const paymentType = getInputPaymentType(input, network);

        switch (paymentType) {
          case 'p2wpkh':
            return {
              index: inputIndex,
              derivationPath: getNativeSegwitAddressIndexDerivationPath(network, accountIndex, 0),
            };
          case 'p2tr':
            return {
              index: inputIndex,
              derivationPath: getTaprootAddressIndexDerivationPath(network, accountIndex, 0),
            };
          default:
            logger.error('Cannot assume zero index for non-segwit input types');
            return { index: inputIndex, derivationPath: '' };
        }
      });
    },
  };
}
