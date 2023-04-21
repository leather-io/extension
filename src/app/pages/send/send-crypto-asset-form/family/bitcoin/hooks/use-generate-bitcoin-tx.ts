import { useCallback } from 'react';

import * as btc from '@scure/btc-signer';

import { logger } from '@shared/logger';
import { BitcoinSendFormValues } from '@shared/models/form.model';

import { btcToSat } from '@app/common/money/unit-conversion';
import { determineUtxosForSpend } from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useGetUtxosByAddressQuery } from '@app/query/bitcoin/address/utxos-by-address.query';
import { useBitcoinLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import {
  useCurrentAccountNativeSegwitSigner,
  useCurrentBitcoinNativeSegwitAddressIndexPublicKeychain,
  useCurrentBtcNativeSegwitAccountAddressIndexZero,
} from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

export function useGenerateSignedBitcoinTx() {
  const currentAccountBtcAddress = useCurrentBtcNativeSegwitAccountAddressIndexZero();
  const { data: utxos } = useGetUtxosByAddressQuery(currentAccountBtcAddress);
  const currentAddressIndexKeychain = useCurrentBitcoinNativeSegwitAddressIndexPublicKeychain();
  const createSigner = useCurrentAccountNativeSegwitSigner();
  const networkMode = useBitcoinLibNetworkConfig();

  return useCallback(
    (values: BitcoinSendFormValues, feeRate: number) => {
      if (!utxos) return;
      if (!feeRate) return;
      if (!createSigner) return;

      try {
        const signer = createSigner(0);

        const tx = new btc.Transaction();

        const { inputs, outputs, fee } = determineUtxosForSpend({
          utxos,
          recipient: values.recipient,
          amount: btcToSat(values.amount).toNumber(),
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
      networkMode,
      utxos,
    ]
  );
}
