import { useCallback } from 'react';

import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

import { BitcoinSendFormValues } from '@shared/models/form.model';

import { btcToSat } from '@app/common/money/unit-conversion';
import { useGetUtxosByAddressQuery } from '@app/query/bitcoin/address/utxos-by-address.query';
import {
  useBitcoinPublicKey,
  useCurrentBtcAccountAddressIndexZero,
} from '@app/store/accounts/blockchain/bitcoin/bitcoin-account.hooks';

const ECPair = ECPairFactory(ecc);

const validator = (pubkey: Buffer, msghash: Buffer, signature: Buffer): boolean =>
  ECPair.fromPublicKey(pubkey).verify(msghash, signature);

// Following examples here: https://github.com/bitcoinjs/bitcoinjs-lib
export function useGenerateBitcoinRawTx() {
  const currentAccountBtcAddress = useCurrentBtcAccountAddressIndexZero();
  const utxos = useGetUtxosByAddressQuery(currentAccountBtcAddress).data;
  const publicKey = useBitcoinPublicKey();

  return useCallback(
    (values: BitcoinSendFormValues) => {
      if (!utxos) return;

      const psbt = new bitcoin.Psbt();
      const signer = ECPair.fromPublicKey(Buffer.from(publicKey ?? ''));

      // TODO: Only use inputs needed
      utxos.map(utxo => {
        psbt.addInput({ hash: utxo.txid, index: utxo.vout });
        psbt.signInput(0, signer);
        psbt.validateSignaturesOfInput(0, validator);
      });
      psbt.finalizeAllInputs();
      psbt.addOutput({
        address: values.recipient,
        value: btcToSat(values.amount).toNumber(),
      });
      // TODO: Add fee
      return psbt.extractTransaction().toHex();
    },
    [publicKey, utxos]
  );
}
