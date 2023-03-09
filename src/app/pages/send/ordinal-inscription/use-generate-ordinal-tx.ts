import { useCallback } from 'react';

import * as btc from '@scure/btc-signer';
import BigNumber from 'bignumber.js';

import { OrdinalSendFormValues } from '@shared/models/form.model';

import { useBitcoinFeeRate } from '@app/query/bitcoin/fees/fee-estimates.hooks';
import { TaprootUtxo } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';
import { useBitcoinLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

export function useGenerateSignedOrdinalTx(utxo: TaprootUtxo, fee: bigint) {
  const createSigner = useCurrentAccountTaprootSigner();
  const networkMode = useBitcoinLibNetworkConfig();
  const { data: feeRate } = useBitcoinFeeRate();

  return useCallback(
    (values: OrdinalSendFormValues) => {
      const signer = createSigner(utxo.addressIndex);

      if (!feeRate) return;

      try {
        const tx = new btc.Transaction();
        tx.addInput({
          txid: utxo.txid,
          index: utxo.vout,
          tapInternalKey: signer.payment.tapInternalKey,
          witnessUtxo: {
            script: signer.payment.script,
            amount: BigInt(utxo.value),
          },
        });
        tx.addOutputAddress(
          values.recipient,
          BigInt(Math.ceil(new BigNumber(utxo.value).minus(fee.toString()).toNumber())),
          networkMode
        );
        signer.sign(tx);
        tx.finalize();
        return { hex: tx.hex, fee };
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Error signing ordinal transaction', e);
        return null;
      }
    },
    [createSigner, fee, feeRate, networkMode, utxo?.addressIndex, utxo.txid, utxo.value, utxo.vout]
  );
}
