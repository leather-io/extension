import { useMemo } from 'react';

import { hexToBytes } from '@noble/hashes/utils';
import * as btc from '@scure/btc-signer';

import { logger } from '@shared/logger';
import { AllowedSighashTypes } from '@shared/rpc/methods/sign-psbt';
import { isString, isUndefined } from '@shared/utils';

import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

export type RawPsbt = ReturnType<typeof btc.RawPSBTV0.decode>;

interface SignPsbtArgs {
  allowedSighash?: AllowedSighashTypes[];
  inputs: btc.TransactionInput[];
  indexesToSign?: number[];
  tx: btc.Transaction;
}

export function usePsbtSigner() {
  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const createTaprootSigner = useCurrentAccountTaprootSigner();

  const nativeSegwitSigner = createNativeSegwitSigner?.(0);
  const taprootSigner = createTaprootSigner?.(0);

  return useMemo(
    () => ({
      signPsbt({ allowedSighash, inputs, indexesToSign, tx }: SignPsbtArgs) {
        inputs.forEach((input, idx) => {
          const isSigning = isUndefined(indexesToSign) || indexesToSign.includes(idx);

          if (!isSigning) return;

          const witnessOutputScript =
            input.witnessUtxo?.script && btc.OutScript.decode(input.witnessUtxo.script);

          // If type taproot, and the tapInternalKey is missing, assume it should
          // be the account publicKey
          if (taprootSigner && witnessOutputScript?.type === 'tr' && !input.tapInternalKey) {
            tx.updateInput(idx, { ...input, tapInternalKey: taprootSigner.payment.tapInternalKey });
          }

          try {
            nativeSegwitSigner?.signIndex(tx, idx, allowedSighash);
          } catch (e1) {
            try {
              taprootSigner?.signIndex(tx, idx, allowedSighash);
            } catch (e2) {
              throw new Error(`Unable to sign PSBT at index, ${e1 ?? e2}`);
            }
          }
        });
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
    [nativeSegwitSigner, taprootSigner]
  );
}
