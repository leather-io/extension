import { useCallback } from 'react';

import * as btc from '@scure/btc-signer';

import { logger } from '@shared/logger';
import { Money } from '@shared/models/money.model';

import { determineUtxosForSpend } from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useSpendableCurrentNativeSegwitAccountUtxos } from '@app/query/bitcoin/address/use-spendable-native-segwit-utxos';
import { useIsStampedTx } from '@app/query/bitcoin/stamps/use-is-stamped-tx';
import { useBitcoinScureLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import {
  useCurrentAccountNativeSegwitAddressIndexZero,
  useCurrentAccountNativeSegwitSigner,
  useCurrentBitcoinNativeSegwitAddressIndexPublicKeychain,
} from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

interface GenerateBitcoinTxValues {
  amount: Money;
  recipient: string;
}

export function useGenerateSignedBitcoinTx() {
  const currentAccountBtcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  const { data: utxos } = useSpendableCurrentNativeSegwitAccountUtxos();
  const currentAddressIndexKeychain = useCurrentBitcoinNativeSegwitAddressIndexPublicKeychain();
  const createSigner = useCurrentAccountNativeSegwitSigner();
  const isStamped = useIsStampedTx();

  const networkMode = useBitcoinScureLibNetworkConfig();

  return useCallback(
    (values: GenerateBitcoinTxValues, feeRate: number) => {
      if (!utxos) return;
      if (!feeRate) return;
      if (!createSigner) return;

      try {
        const signer = createSigner(0);

        const tx = new btc.Transaction();

        const { inputs, outputs, fee } = determineUtxosForSpend({
          utxos: utxos.filter(utxo => !isStamped(utxo.txid)),
          recipient: values.recipient,
          amount: values.amount.amount.toNumber(),
          feeRate,
        });

        logger.info('coinselect', { inputs, outputs, fee });

        if (!inputs.length) throw new Error('No inputs to sign');
        if (!outputs.length) throw new Error('No outputs to sign');

        if (outputs.length > 2)
          throw new Error('Address reuse mode: wallet should have max 2 outputs');

        inputs.forEach(input => {
          const p2wpkh = btc.p2wpkh(currentAddressIndexKeychain?.publicKey!, networkMode);
          tx.addInput({
            txid: input.txid,
            index: input.vout,
            witnessUtxo: {
              // script = 0014 + pubKeyHash
              script: p2wpkh.script,
              amount: BigInt(input.value),
            },
          });
        });
        outputs.forEach(output => {
          // When coin selection returns output with no address we assume it is
          // a change output
          if (!output.address) {
            tx.addOutputAddress(currentAccountBtcAddress, BigInt(output.value), networkMode);
            return;
          }
          tx.addOutputAddress(values.recipient, BigInt(output.value), networkMode);
        });
        signer.sign(tx);
        tx.finalize();

        return { hex: tx.hex, fee };
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Error signing bitcoin transaction', e);
        return null;
      }
    },
    [
      createSigner,
      currentAccountBtcAddress,
      currentAddressIndexKeychain?.publicKey,
      isStamped,
      networkMode,
      utxos,
    ]
  );
}
