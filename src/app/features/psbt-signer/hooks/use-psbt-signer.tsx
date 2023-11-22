import { useMemo } from 'react';

import { hexToBytes } from '@noble/hashes/utils';
import * as btc from '@scure/btc-signer';

import { logger } from '@shared/logger';
import { isString } from '@shared/utils';

import {
  useAddTapInternalKeysIfMissing,
  useSignBitcoinTx,
} from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

export type RawPsbt = ReturnType<typeof btc.RawPSBTV0.decode>;

interface SignPsbtArgs {
  indexesToSign?: number[];
  tx: btc.Transaction;
}
export function usePsbtSigner() {
  const addMissingTapInteralKeys = useAddTapInternalKeysIfMissing();
  const signBitcoinTx = useSignBitcoinTx();

  return useMemo(
    () => ({
      async signPsbt({ indexesToSign, tx }: SignPsbtArgs) {
        addMissingTapInteralKeys(tx, indexesToSign);
        return signBitcoinTx(tx.toPSBT(), indexesToSign);
      },
      getPsbtAsTransaction(psbt: string | Uint8Array) {
        const bytes = isString(psbt) ? hexToBytes(psbt) : psbt;
        return btc.Transaction.fromPSBT(bytes);
      },
      getRawPsbt(psbt: string | Uint8Array) {
        const bytes = isString(psbt) ? hexToBytes(psbt) : psbt;
        try {
          return btc.RawPSBTV0.decode(bytes);
        } catch (e1) {
          logger.error(`Unable to decode PSBT as v0, trying v2, ${e1}`);
          try {
            return btc.RawPSBTV2.decode(bytes);
          } catch (e2) {
            throw new Error(`Unable to decode PSBT, ${e1 ?? e2}`);
          }
        }
      },
    }),
    [addMissingTapInteralKeys, signBitcoinTx]
  );
}
