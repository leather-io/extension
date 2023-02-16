import { useCallback } from 'react';

import { hexToBytes } from '@stacks/common';
import * as btc from 'micro-btc-signer';

import { getBtcSignerLibNetworkByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import { BitcoinSendFormValues } from '@shared/models/form.model';

import { btcToSat } from '@app/common/money/unit-conversion';
import { useGetUtxosByAddressQuery } from '@app/query/bitcoin/address/utxos-by-address.query';
import { useBitcoinFeeRate } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import {
  useCurrentBitcoinAddressIndexKeychain,
  useCurrentBtcAccountAddressIndexZero,
  useSignBitcoinTx,
} from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { determineUtxosForSpend } from '../../family/bitcoin/coinselect/local-coin-selection';

export function useGenerateSignedBitcoinTx() {
  const currentAccountBtcAddress = useCurrentBtcAccountAddressIndexZero();
  const { data: utxos } = useGetUtxosByAddressQuery(currentAccountBtcAddress);
  const currentAddressIndexKeychain = useCurrentBitcoinAddressIndexKeychain();
  const signTx = useSignBitcoinTx();
  const network = useCurrentNetwork();
  const { data: feeRate } = useBitcoinFeeRate();

  return useCallback(
    (values: BitcoinSendFormValues) => {
      if (!utxos) return;
      if (!feeRate) return;

      const networkMode = getBtcSignerLibNetworkByMode(network.chain.bitcoin.network);

      try {
        const tx = new btc.Transaction();

        const { inputs, outputs, fee } = determineUtxosForSpend({
          utxos,
          recipient: values.recipient,
          amount: btcToSat(values.amount).toNumber(),
          feeRate: feeRate.fastestFee,
        });

        // eslint-disable-next-line no-console
        console.log('coinselect', { inputs, outputs, fee });

        if (!inputs) throw new Error('No inputs to sign');
        if (!outputs) throw new Error('No outputs to sign');

        if (outputs.length > 2)
          throw new Error('Address reuse mode: wallet should have max 2 outputs');

        inputs.forEach(input => {
          const p2wpkh = btc.p2wpkh(currentAddressIndexKeychain.publicKey!, networkMode);
          tx.addInput({
            txid: hexToBytes(input.txid),
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
        signTx(tx);
        tx.finalize();
        return { hex: tx.hex, fee };
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Error signing bitcoin transaction', e);
        return null;
      }
    },
    [
      currentAccountBtcAddress,
      currentAddressIndexKeychain.publicKey,
      feeRate,
      network.chain.bitcoin.network,
      signTx,
      utxos,
    ]
  );
}
