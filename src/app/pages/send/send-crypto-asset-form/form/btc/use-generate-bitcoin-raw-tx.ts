import { useCallback } from 'react';

import { hexToBytes } from '@stacks/common';
import { coinselection } from 'coinselection-ts';
import * as btc from 'micro-btc-signer';

import { getBtcSignerLibNetworkByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import { logger } from '@shared/logger';
import { BitcoinSendFormValues } from '@shared/models/form.model';

import { useGetUtxosByAddressQuery } from '@app/query/bitcoin/address/utxos-by-address.query';
import {
  useCurrentBitcoinAddressIndexKeychain,
  useCurrentBtcAccountAddressIndexZero,
  useSignBitcoinTx,
} from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.hooks';

export function useGenerateBitcoinRawTx() {
  const currentAccountBtcAddress = useCurrentBtcAccountAddressIndexZero();
  const utxos = useGetUtxosByAddressQuery(currentAccountBtcAddress).data;
  const currentAddressIndexKeychain = useCurrentBitcoinAddressIndexKeychain();
  const signTx = useSignBitcoinTx();

  return useCallback(
    function (values: BitcoinSendFormValues) {
      if (!utxos) return;
      try {
        const tx = new btc.Transaction();
        // TODO: Only use inputs needed

        const s = coinselection(utxos, [{ value: Number(values.amount) }], 1, 10);
        logger.debug('coinsel', s);

        [utxos[0]].forEach(utxo => {
          const p2wpkh = btc.p2wpkh(
            currentAddressIndexKeychain.publicKey!,
            getBtcSignerLibNetworkByMode('testnet')
          );
          // console.log(p2wpkh);
          tx.addInput({
            txid: hexToBytes(utxo.txid),
            index: utxo.vout,
            witnessUtxo: {
              // script = 0014 + pubKeyHash
              script: p2wpkh.script,
              amount: BigInt(utxo.value),
            },
          });
          tx.addOutputAddress(
            values.recipient,
            // temp 2% fee
            BigInt(utxo.value * 0.98),
            getBtcSignerLibNetworkByMode('testnet')
          );
        });
        signTx(tx);
        tx.finalize();
        return tx.hex;
      } catch (e) {
        return null;
      }
    },
    [currentAddressIndexKeychain, signTx, utxos]
  );
}
